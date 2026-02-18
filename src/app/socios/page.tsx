import { getPublicMembers } from "@/lib/actions/members";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  MapPin,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { Pagination } from "@/components/shared/Pagination";

interface PageProps {
  searchParams?: {
    membershipLevel?: string;
    city?: string;
    search?: string;
    page?: string;
  };
}

export default async function MembersDirectoryPage({ searchParams }: PageProps) {
  const membershipLevel = searchParams?.membershipLevel || "all";
  const city = searchParams?.city || "";
  const search = searchParams?.search || "";
  const page = parseInt(searchParams?.page || "1");
  const limit = 20;

  const result = await getPublicMembers({
    membershipLevel,
    city,
    search,
    page,
    limit,
  });

  const members = result.success ? result.members : [];
  const pagination = result.success ? result.pagination : null;

  const membershipLevelLabels = {
    STANDARD: "Socio Estándar",
    COLLABORATOR: "Socio Colaborador",
    HONORARY: "Socio de Honor",
    INSTITUTIONAL: "Socio Institucional",
  };

  const membershipLevelColors = {
    STANDARD: "bg-blue-100 text-blue-700",
    COLLABORATOR: "bg-coral-100 text-coral-700",
    HONORARY: "bg-yellow-100 text-yellow-700",
    INSTITUTIONAL: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-azul text-white">
        <div className="max-w-content mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Directorio de Socios
            </h1>
            <p className="text-lg text-gray-200">
              Conoce a los miembros de la Asociación Cultural Olvidos de Granada.
              Una comunidad de personas apasionadas por la cultura y la literatura.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-12">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form className="grid gap-6 md:grid-cols-4">
              {/* Search */}
              <div className="md:col-span-2">
                <Label htmlFor="search" className="flex items-center gap-2 mb-2">
                  <Search className="h-4 w-4" />
                  Buscar socio
                </Label>
                <Input
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Nombre o descripción..."
                  defaultValue={search}
                />
              </div>

              {/* Membership Level */}
              <div>
                <Label htmlFor="membershipLevel" className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4" />
                  Nivel
                </Label>
                <select
                  id="membershipLevel"
                  name="membershipLevel"
                  defaultValue={membershipLevel}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">Todos los niveles</option>
                  <option value="STANDARD">Socio Estándar</option>
                  <option value="COLLABORATOR">Socio Colaborador</option>
                  <option value="HONORARY">Socio de Honor</option>
                  <option value="INSTITUTIONAL">Socio Institucional</option>
                </select>
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city" className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  Ciudad
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Ej: Granada"
                  defaultValue={city}
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-4">
                <Button type="submit" className="w-full md:w-auto">
                  Aplicar Filtros
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {pagination && (
              <>
                Mostrando <span className="font-semibold">{members.length}</span> de{" "}
                <span className="font-semibold">{pagination.total}</span> socios
              </>
            )}
          </p>
        </div>

        {/* Members Grid */}
        {members.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron socios
              </h3>
              <p className="text-gray-600">
                Intenta con otros filtros o términos de búsqueda
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {members.map((member: any) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-azul text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {member.user.name?.charAt(0) || "S"}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {member.user.name || "Socio"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          #{member.memberNumber}
                        </p>

                        {/* Level Badge */}
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                            membershipLevelColors[member.membershipLevel]
                          }`}
                        >
                          {membershipLevelLabels[member.membershipLevel]}
                        </span>

                        {/* City */}
                        {member.city && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            {member.city}
                          </div>
                        )}

                        {/* Bio */}
                        {member.bio && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {member.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  basePath="/socios"
                  searchParams={{
                    membershipLevel,
                    city,
                    search,
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* CTA */}
        {!members.length && (
          <Card className="mt-8 bg-coral-50 border-coral-200">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-semibold text-coral-900 mb-2">
                ¿Quieres ser socio?
              </h3>
              <p className="text-coral-700 mb-4">
                Únete a nuestra comunidad y disfruta de todos los beneficios
              </p>
              <Button asChild className="bg-coral hover:bg-coral-dark">
                <Link href="/hazte-socio">Hazte Socio</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
