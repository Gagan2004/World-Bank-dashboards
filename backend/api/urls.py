from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DataPointViewSet, FilterOptionsView

router = DefaultRouter()
router.register(r'world-data', DataPointViewSet, basename='worlddata')

urlpatterns = [
    path('filter-options/', FilterOptionsView.as_view(), name='filter-options'),
    path('', include(router.urls)),
]
