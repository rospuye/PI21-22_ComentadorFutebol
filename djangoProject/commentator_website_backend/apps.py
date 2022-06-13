from django.apps import AppConfig
from commentator_website_backend.business_logic import global_var

teste = 0

class CommentatorWebsiteBackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'commentator_website_backend'

    def ready(self):
        global_var.createCache()
