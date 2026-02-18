import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
      return NextResponse.json(
        { error: "No tienes permisos" },
        { status: 403 }
      );
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, tag });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { error: "Error al obtener el tag" },
      { status: 500 }
    );
  }
}
