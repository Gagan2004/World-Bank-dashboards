from django.core.management.base import BaseCommand
import pandas as pd
from api.models import DataPoint

class Command(BaseCommand):
    help = 'Import World Bank data from CSV'

    def handle(self, *args, **kwargs):
        # Correct path to the CSV file
        csv_file = '../API_SE.PRM.CMPT.FE.ZS_DS2_en_csv_v2_20335.csv'
        
        # Read the CSV, skipping the first 4 rows of metadata
        df = pd.read_csv(csv_file, skiprows=4)
        
        # Melt the dataframe to transform it from wide to long format
        df_melted = df.melt(id_vars=['Country Name', 'Country Code', 'Indicator Name', 'Indicator Code'], 
                            var_name='Year', 
                            value_name='Value')
        
        # Rename columns for clarity and consistency
        df_melted.rename(columns={'Country Name': 'Country', 'Value': 'Primary Completion Rate'}, inplace=True)
        
        # Convert 'Year' to numeric, coercing errors to NaN
        df_melted['Year'] = pd.to_numeric(df_melted['Year'], errors='coerce')
        
        # Drop rows where 'Year' could not be converted
        df_melted.dropna(subset=['Year'], inplace=True)
        
        # Convert 'Year' to integer
        df_melted['Year'] = df_melted['Year'].astype(int)
        
        # Clear existing data to avoid duplicates
        DataPoint.objects.all().delete()
        
        # Iterate over the dataframe and create DataPoint objects
        for index, row in df_melted.iterrows():
            # Ensure 'Primary Completion Rate' is a float, handling non-numeric values
            try:
                completion_rate = float(row['Primary Completion Rate'])
            except (ValueError, TypeError):
                continue  # Skip rows where conversion to float fails

            DataPoint.objects.create(
                country=row['Country'],
                year=row['Year'],
                # Placeholder for gdp_per_capita and population
                gdp_per_capita=0,  
                population=0,
                primary_completion_rate=completion_rate
            )
            
        self.stdout.write(self.style.SUCCESS('Successfully imported data'))
