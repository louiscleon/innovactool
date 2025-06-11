/**
 * Données sectorielles simulées pour les comparaisons
 * Ces données représentent les moyennes et médianes du secteur
 * de la programmation informatique (code NAF 6201Z)
 */

export const mockSectoralData = {
  sector: {
    code: "6201Z",
    name: "Programmation informatique",
    companies: 42850,
    total_revenue: 82500000000,
    average_employees: 18
  },
  financial_averages: {
    "2021": {
      revenue_avg: 1100000,
      revenue_median: 850000,
      net_margin_avg: 0.085,
      net_margin_median: 0.072,
      growth_rate: 0.068,
      cash_ratio_avg: 0.32,
      days_sales_outstanding_avg: 48
    },
    "2022": {
      revenue_avg: 1250000,
      revenue_median: 920000,
      net_margin_avg: 0.088,
      net_margin_median: 0.074,
      growth_rate: 0.085,
      cash_ratio_avg: 0.34,
      days_sales_outstanding_avg: 52
    },
    "2023": {
      revenue_avg: 1380000,
      revenue_median: 980000,
      net_margin_avg: 0.092,
      net_margin_median: 0.078,
      growth_rate: 0.07,
      cash_ratio_avg: 0.36,
      days_sales_outstanding_avg: 56
    },
    "2024_projection": {
      revenue_growth: 0.058,
      net_margin_projection: 0.085,
      cash_ratio_projection: 0.33,
      days_sales_outstanding_projection: 59
    }
  },
  market_trends: [
    {
      name: "Adoption du cloud",
      trend: "strong_increase",
      impact_on_revenue: "positive",
      impact_on_margins: "neutral"
    },
    {
      name: "Intelligence artificielle",
      trend: "strong_increase",
      impact_on_revenue: "positive",
      impact_on_margins: "positive"
    },
    {
      name: "Cybersécurité",
      trend: "increase",
      impact_on_revenue: "positive",
      impact_on_margins: "positive"
    },
    {
      name: "Pénurie de talents",
      trend: "increase",
      impact_on_revenue: "negative",
      impact_on_margins: "negative"
    },
    {
      name: "Inflation",
      trend: "moderate_increase",
      impact_on_revenue: "neutral",
      impact_on_margins: "negative"
    }
  ],
  company_size_comparisons: {
    "small": {
      employees_range: "1-10",
      revenue_avg: 520000,
      net_margin_avg: 0.11,
      days_sales_outstanding_avg: 46
    },
    "medium": {
      employees_range: "11-50",
      revenue_avg: 1700000,
      net_margin_avg: 0.09,
      days_sales_outstanding_avg: 55
    },
    "large": {
      employees_range: "51-250",
      revenue_avg: 10500000,
      net_margin_avg: 0.084,
      days_sales_outstanding_avg: 62
    }
  },
  regional_differences: {
    "ile_de_france": {
      companies_percentage: 0.42,
      revenue_multiplier: 1.25,
      salary_multiplier: 1.2
    },
    "auvergne_rhone_alpes": {
      companies_percentage: 0.14,
      revenue_multiplier: 1.05,
      salary_multiplier: 1.08
    },
    "occitanie": {
      companies_percentage: 0.08,
      revenue_multiplier: 0.95,
      salary_multiplier: 0.9
    },
    "nouvelle_aquitaine": {
      companies_percentage: 0.07,
      revenue_multiplier: 0.9,
      salary_multiplier: 0.88
    },
    "other_regions": {
      companies_percentage: 0.29,
      revenue_multiplier: 0.85,
      salary_multiplier: 0.82
    }
  },
  risk_assessment: {
    "payment_delays": {
      risk_level: "medium",
      trend: "worsening",
      impact: "cash_flow"
    },
    "talent_shortage": {
      risk_level: "high",
      trend: "stable",
      impact: "growth_potential"
    },
    "market_saturation": {
      risk_level: "low",
      trend: "stable",
      impact: "pricing_power"
    },
    "technological_disruption": {
      risk_level: "medium",
      trend: "increasing",
      impact: "business_model"
    }
  }
}; 