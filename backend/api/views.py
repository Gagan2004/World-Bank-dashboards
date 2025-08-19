from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Min, Max
from .models import DataPoint
from .serializers import DataPointSerializer

class DataPointViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DataPoint.objects.all()
    serializer_class = DataPointSerializer

    def get_queryset(self):
        queryset = DataPoint.objects.all()
        start_year = self.request.query_params.get('start_year')
        end_year = self.request.query_params.get('end_year')
        # Handle both 'country' (string) and 'countries[]' (array)
        countries = self.request.query_params.getlist('countries[]')
        if not countries:
            country_str = self.request.query_params.get('country')
            if country_str:
                countries = country_str.split(',')

        if start_year:
            queryset = queryset.filter(year__gte=start_year)
        if end_year:
            queryset = queryset.filter(year__lte=end_year)
        if countries:
            queryset = queryset.filter(country__in=countries)
            
        return queryset

class FilterOptionsView(APIView):
    def get(self, request, *args, **kwargs):
        countries = DataPoint.objects.values_list('country', flat=True).distinct().order_by('country')
        year_range = DataPoint.objects.aggregate(min_year=Min('year'), max_year=Max('year'))
        return Response({
            'countries': countries,
            'year_range': year_range,
        })

