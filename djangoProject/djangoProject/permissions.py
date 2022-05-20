from rest_framework.permissions import BasePermission, SAFE_METHODS
from commentator_website_backend.models import Game

class IsReadOnlyOrIsOwnerOrIsAdmin(BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        # Admin can do everything
        if request.user.is_superuser:
            return True

        if not request.user.is_anonymous:
            # If normal user

            if request.method == "PUT" or request.method == "PATCH" or request.method == "DELETE":
                if isinstance(obj, Game) and obj.user == request.user:
                    return True

        return False


class IsOwnerOrIsAdmin(BasePermission):

    def has_object_permission(self, request, view, obj):
        return (obj == request.user and request.method != "DELETE") or request.user.is_superuser
