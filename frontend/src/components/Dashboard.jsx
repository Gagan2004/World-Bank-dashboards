import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getFilterOptions, getWorldData } from '../api';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [yearRange, setYearRange] = useState({ min_year: 1960, max_year: 2025 });
  
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setIsLoading(true);
      try {
        const response = await getFilterOptions();
        const countryOptions = response.data.countries.map(c => ({ value: c, label: c }));
        setCountries(countryOptions);
        setYearRange(response.data.year_range);
        
        setStartYear(response.data.year_range.min_year || 1900);
        setEndYear(response.data.year_range.max_year || 2020);
        
        const initialCountries = countryOptions.filter(c => ['United States', 'Brazil', 'India', 'China'].includes(c.value));
        setSelectedCountries(initialCountries);

      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCountries.length === 0 || !startYear || !endYear) {
          setData([]);
          return;
      }
      setIsLoading(true);
      try {
        const params = {
          start_year: startYear,
          end_year: endYear,
          'countries[]': selectedCountries.map(c => c.value),
        };

        const response = await getWorldData(params);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCountries, startYear, endYear]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const yearOptions = () => {
    if (!yearRange.min_year) return [];
    const years = [];
    for (let i = yearRange.min_year; i <= yearRange.max_year; i++) {
      years.push({ value: i, label: i });
    }
    return years;
  };

  // Custom styles for react-select with dark theme
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: '#1f2937',
      borderColor: state.isFocused ? '#3b82f6' : '#374151',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      color: '#f3f4f6',
      minHeight: '48px',
      '&:hover': {
        borderColor: '#3b82f6',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
        ? '#374151'
        : '#1f2937',
      color: '#f3f4f6',
      '&:hover': {
        backgroundColor: '#374151',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#3b82f6',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#ffffff',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#2563eb',
        color: '#ffffff',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: '#f3f4f6',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
    }),
    input: (base) => ({
      ...base,
      color: '#f3f4f6',
    }),
  };

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

  const lineChartData = {
    labels: [...new Set(data.map((item) => item.year))].sort((a, b) => a - b),
    datasets: selectedCountries.map((country, index) => {
        const countryData = data.filter(item => item.country === country.value).sort((a, b) => a.year - b.year);
        return {
            label: country.label,
            data: countryData.map((item) => item.primary_completion_rate),
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length] + '20',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
        };
    }),
  };

  const barChartData = {
    labels: selectedCountries.map(c => c.label),
    datasets: [{
        label: 'Average Primary Completion Rate',
        data: selectedCountries.map(country => {
            const countryData = data.filter(item => item.country === country.value);
            const sum = countryData.reduce((acc, item) => acc + (item.primary_completion_rate || 0), 0);
            return countryData.length > 0 ? sum / countryData.length : 0;
        }),
        backgroundColor: selectedCountries.map((_, index) => colors[index % colors.length] + '80'),
        borderColor: selectedCountries.map((_, index) => colors[index % colors.length]),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#f3f4f6',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#f3f4f6',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
        },
        grid: {
          color: '#374151',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          },
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading data...</p>
    </div>
  );

  const NoDataComponent = () => (
    <div className="no-data-container">
      <div className="no-data-icon">📊</div>
      <h3>No Data Available</h3>
      <p>Please adjust your filters to view data for the selected criteria.</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-background">
        <div className="bg-gradient"></div>
        <div className="bg-grid"></div>
      </div>
      
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-icon">📈</div>
              <h1>World Data Analytics</h1>
            </div>
            <span className="subtitle">Primary Education Completion Insights</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <span>Logout</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      <div className="filters-panel">
        <div className="filters-container">
          <div className="filter-group">
            <label>Countries</label>
            <Select
              options={countries}
              isMulti
              onChange={setSelectedCountries}
              value={selectedCountries}
              placeholder="Select countries..."
              styles={selectStyles}
              className="country-select"
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </div>
          
          <div className="year-filters">
            <div className="filter-group">
              <label>Start Year</label>
              <Select
                options={yearOptions()}
                onChange={opt => setStartYear(opt.value)}
                value={startYear ? { value: startYear, label: startYear } : null}
                placeholder="Start"
                styles={selectStyles}
                className="year-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
            
            <div className="filter-group">
              <label>End Year</label>
              <Select
                options={yearOptions()}
                onChange={opt => setEndYear(opt.value)}
                value={endYear ? { value: endYear, label: endYear } : null}
                placeholder="End"
                styles={selectStyles}
                className="year-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="charts-container">
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h2>📈 Completion Rate Trends</h2>
              <p>Track primary education completion rates over time</p>
            </div>
            <div className="chart-content">
              {isLoading ? (
                <LoadingSpinner />
              ) : data.length > 0 ? (
                <Line data={lineChartData} options={chartOptions} />
              ) : (
                <NoDataComponent />
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h2>📊 Country Comparison</h2>
              <p>Compare average completion rates across selected countries</p>
            </div>
            <div className="chart-content">
              {isLoading ? (
                <LoadingSpinner />
              ) : data.length > 0 ? (
                <Bar data={barChartData} options={chartOptions} />
              ) : (
                <NoDataComponent />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;