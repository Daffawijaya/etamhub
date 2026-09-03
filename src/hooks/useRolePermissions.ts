"use client";

import { useState, useEffect } from "react";

export interface RolePermissions {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface UseRolePermissionsResult {
  permissions: Record<string, RolePermissions>;
  loading: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canRead: boolean;
}

export function useRolePermissions(userRole?: string | null): UseRolePermissionsResult {
  const [permissions, setPermissions] = useState<Record<string, RolePermissions>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userRole || userRole === "super_admin") {
      setLoading(false);
      return;
    }

    fetch("/api/role-permissions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, RolePermissions> = {};
          for (const p of data) {
            map[p.role] = {
              canCreate: p.canCreate,
              canRead: p.canRead,
              canUpdate: p.canUpdate,
              canDelete: p.canDelete,
            };
          }
          setPermissions(map);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userRole]);

  const rolePerms = permissions[userRole ?? ""] ?? {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
  };

  // super_admin always has all permissions
  const isSuperAdmin = userRole === "super_admin";

  return {
    permissions,
    loading,
    canCreate: isSuperAdmin || rolePerms.canCreate,
    canUpdate: isSuperAdmin || rolePerms.canUpdate,
    canDelete: isSuperAdmin || rolePerms.canDelete,
    canRead: isSuperAdmin || rolePerms.canRead,
  };
}
