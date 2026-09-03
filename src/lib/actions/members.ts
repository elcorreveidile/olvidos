"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { isStaffRole, roleForMemberStatus } from "@/lib/roles";

const MemberSchema = z.object({
  userId: z.string().optional(),
  membershipLevel: z.enum(["STANDARD", "COLLABORATOR", "HONORARY", "INSTITUTIONAL", "HONOR"]).default("STANDARD"),
  status: z.enum(["PENDING", "ACTIVE", "EXPIRED", "SUSPENDED", "CANCELLED"]).default("PENDING"),
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  isPublic: z.boolean().default(false),
});

const MemberUpdateSchema = z.object({
  membershipLevel: z.enum(["STANDARD", "COLLABORATOR", "HONORARY", "INSTITUTIONAL", "HONOR"]).optional(),
  status: z.enum(["PENDING", "ACTIVE", "EXPIRED", "SUSPENDED", "CANCELLED"]).optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type MemberInput = z.infer<typeof MemberSchema>;
export type MemberUpdateInput = z.infer<typeof MemberUpdateSchema>;

// Edición completa de un socio por el admin: incluye datos de la cuenta (nombre,
// correo) además de los del socio (nivel, estado, alta, contacto, DNI…).
const AdminSocioSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").optional(),
  email: z.string().trim().email("Correo no válido").optional(),
  membershipLevel: z
    .enum(["STANDARD", "COLLABORATOR", "HONORARY", "INSTITUTIONAL", "HONOR"])
    .optional(),
  status: z.enum(["PENDING", "ACTIVE", "EXPIRED", "SUSPENDED", "CANCELLED"]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  dni: z.string().optional(),
  joinDate: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export async function adminUpdateSocio(memberId: string, data: unknown) {
  try {
    await checkAdminPermission();
    const d = AdminSocioSchema.parse(data);

    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { user: true },
    });
    if (!member) return { success: false, error: "El socio no existe" };

    // Correo: normalizar y comprobar que no lo tenga otra cuenta.
    if (d.email && d.email.toLowerCase() !== member.user.email.toLowerCase()) {
      const taken = await db.user.findUnique({
        where: { email: d.email.toLowerCase() },
      });
      if (taken && taken.id !== member.userId) {
        return { success: false, error: "Ya existe una cuenta con ese correo." };
      }
    }

    const userData: Record<string, unknown> = {};
    if (d.name !== undefined) userData.name = d.name;
    if (d.email !== undefined) userData.email = d.email.toLowerCase();
    if (Object.keys(userData).length) {
      await db.user.update({ where: { id: member.userId }, data: userData });
    }

    const memberData: Record<string, unknown> = {};
    if (d.membershipLevel) memberData.membershipLevel = d.membershipLevel;
    if (d.status) memberData.status = d.status;
    if (d.phone !== undefined) memberData.phone = d.phone || null;
    if (d.address !== undefined) memberData.address = d.address || null;
    if (d.city !== undefined) memberData.city = d.city || null;
    if (d.dni !== undefined) memberData.dni = d.dni || null;
    if (d.isPublic !== undefined) memberData.isPublic = d.isPublic;
    if (d.joinDate) {
      const jd = new Date(d.joinDate);
      if (!Number.isNaN(jd.getTime())) memberData.joinDate = jd;
    }
    if (Object.keys(memberData).length) {
      await db.member.update({ where: { id: memberId }, data: memberData });
    }

    revalidatePath("/admin/socios");
    revalidatePath(`/admin/socios/${memberId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar el socio",
    };
  }
}

// Check if user has admin permission
async function checkAdminPermission() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autenticado");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "MEMBER_ADMIN")) {
    throw new Error("No tienes permiso para realizar esta acción");
  }

  return session.user.id;
}

// Create member manually (admin only)
export async function createMember(data: MemberInput) {
  try {
    await checkAdminPermission();

    // Validate data
    const validatedData = MemberSchema.parse(data);

    if (!validatedData.userId) {
      throw new Error("El userId es obligatorio");
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      throw new Error("El usuario no existe");
    }

    // Check if member already exists
    const existingMember = await db.member.findUnique({
      where: { userId: validatedData.userId },
    });

    if (existingMember) {
      throw new Error("El usuario ya es socio");
    }

    // Create member
    const member = await db.member.create({
      data: {
        userId: validatedData.userId,
        membershipLevel: validatedData.membershipLevel,
        status: validatedData.status,
        bio: validatedData.bio,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        isPublic: validatedData.isPublic,
      },
      include: {
        user: true,
      },
    });

    // Update user role (sin pisar los roles del equipo: un editor que se hace
    // socio sigue siendo editor).
    if (!isStaffRole(user.role)) {
      await db.user.update({
        where: { id: validatedData.userId },
        data: { role: "MEMBER" },
      });
    }

    revalidatePath("/admin/socios");
    revalidatePath("/socios");

    return { success: true, member };
  } catch (error) {
    console.error("Error creating member:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear el socio",
    };
  }
}

// Update member (admin or own profile)
export async function updateMember(id: string, data: MemberUpdateInput) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("No autenticado");
    }

    // Validate data
    const validatedData = MemberUpdateSchema.parse(data);

    // Check if member exists
    const existingMember = await db.member.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingMember) {
      throw new Error("El socio no existe");
    }

    // Check permissions: admin or own profile
    const isAdmin =
      session.user.role === "ADMIN" ||
      session.user.role === "MEMBER_ADMIN";

    if (existingMember.userId !== session.user.id && !isAdmin) {
      throw new Error("No tienes permiso para actualizar este socio");
    }

    // If not admin, only allow updating specific fields
    const updateData: any = {};
    if (isAdmin) {
      if (validatedData.membershipLevel) updateData.membershipLevel = validatedData.membershipLevel;
      if (validatedData.status) updateData.status = validatedData.status;
    }
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
    if (validatedData.address !== undefined) updateData.address = validatedData.address;
    if (validatedData.city !== undefined) updateData.city = validatedData.city;
    if (validatedData.isPublic !== undefined) updateData.isPublic = validatedData.isPublic;

    // Update member
    const member = await db.member.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
      },
    });

    // Sync user role with member status. Los roles del equipo (EDITOR,
    // MEMBER_ADMIN, ADMIN) no se tocan: guardar la ficha de un socio que es
    // editor no debe degradarlo.
    if (isAdmin && validatedData.status) {
      const userRole = roleForMemberStatus(member.user.role, validatedData.status === "ACTIVE");
      if (userRole && userRole !== member.user.role) {
        await db.user.update({
          where: { id: existingMember.userId },
          data: { role: userRole },
        });
      }
    }

    revalidatePath("/admin/socios");
    revalidatePath("/socios");
    revalidatePath("/mi-cuenta");
    revalidatePath(`/admin/socios/${id}`);

    return { success: true, member };
  } catch (error) {
    console.error("Error updating member:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar el socio",
    };
  }
}

// Get member by ID
export async function getMember(id: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("No autenticado");
    }

    const member = await db.member.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!member) {
      throw new Error("Socio no encontrado");
    }

    // Check permissions
    const isAdmin =
      session.user.role === "ADMIN" ||
      session.user.role === "MEMBER_ADMIN";

    if (member.userId !== session.user.id && !isAdmin) {
      throw new Error("No tienes permiso para ver este socio");
    }

    return { success: true, member };
  } catch (error) {
    console.error("Error fetching member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener el socio",
    };
  }
}

// Get current member (logged in user)
export async function getCurrentMember() {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("No autenticado");
    }

    const member = await db.member.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
      },
    });

    if (!member) {
      return { success: false, error: "No eres socio aún" };
    }

    return { success: true, member };
  } catch (error) {
    console.error("Error fetching current member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener el socio",
    };
  }
}

// Get all members with filters (admin only)
export async function getMembers(filters?: {
  status?: string;
  membershipLevel?: string;
  city?: string;
  search?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("No autenticado");
    }

    // Check if admin
    const isAdmin =
      session.user.role === "ADMIN" ||
      session.user.role === "MEMBER_ADMIN";

    // If not admin, only show public active members
    if (!isAdmin) {
      filters = { ...filters, isPublic: true, status: "ACTIVE" };
    }

    const status = filters?.status;
    const membershipLevel = filters?.membershipLevel;
    const city = filters?.city;
    const search = filters?.search;
    const isPublic = filters?.isPublic;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (membershipLevel && membershipLevel !== "all") {
      where.membershipLevel = membershipLevel;
    }

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { memberNumber: { equals: parseInt(search) || 0 } },
      ];
    }

    const [members, total] = await Promise.all([
      db.member.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          memberNumber: "asc",
        },
        skip,
        take: limit,
      }),
      db.member.count({ where }),
    ]);

    return {
      success: true,
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching members:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los socios",
    };
  }
}

// Delete member (soft delete - change status to CANCELLED)
export async function deleteMember(id: string) {
  try {
    await checkAdminPermission();

    // Check if member exists
    const existingMember = await db.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      throw new Error("El socio no existe");
    }

    // Soft delete by changing status to CANCELLED
    await db.member.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    // Update user role (los roles del equipo se conservan)
    const cancelledUser = await db.user.findUnique({ where: { id: existingMember.userId }, select: { role: true } });
    if (cancelledUser && !isStaffRole(cancelledUser.role)) {
      await db.user.update({
        where: { id: existingMember.userId },
        data: { role: "USER" },
      });
    }

    revalidatePath("/admin/socios");
    revalidatePath("/socios");

    return { success: true };
  } catch (error) {
    console.error("Error deleting member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al eliminar el socio",
    };
  }
}

// Get public members (for directory)
export async function getPublicMembers(filters?: {
  membershipLevel?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const membershipLevel = filters?.membershipLevel;
    const city = filters?.city;
    const search = filters?.search;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublic: true,
      status: "ACTIVE",
    };

    if (membershipLevel && membershipLevel !== "all") {
      where.membershipLevel = membershipLevel;
    }

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }

    const [members, total] = await Promise.all([
      db.member.findMany({
        where,
        select: {
          id: true,
          memberNumber: true,
          membershipLevel: true,
          city: true,
          bio: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          memberNumber: "asc",
        },
        skip,
        take: limit,
      }),
      db.member.count({ where }),
    ]);

    return {
      success: true,
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching public members:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener los socios",
    };
  }
}
