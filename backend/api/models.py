from django.db import models

class DataPoint(models.Model):
    country = models.CharField(max_length=100)
    year = models.IntegerField()
    gdp_per_capita = models.FloatField()
    population = models.IntegerField()
    primary_completion_rate = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.country} - {self.year}"

