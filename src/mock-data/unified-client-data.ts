/**
 * Données unifiées pour le client et le secteur
 * Ce fichier sert de source de vérité unique pour toutes les données
 * utilisées dans l'application, garantissant la cohérence des informations
 */

// Les données client
export const clientData = {
  // Informations générales
  company: {
    name: "InfoTech Solutions",
    siren: "123456789",
    sector_code: "6201Z",
    sector_name: "Programmation informatique",
    creation_date: "2017-03-15",
    employees: 24,
    legal_form: "SAS",
    address: "12 rue de l'Innovation, 75002 Paris",
    capital: 50000,
    directors: [
      { name: "Martin Dubois", role: "Président", since: "2017-03-15" },
      { name: "Sophie Leroy", role: "Directrice Technique", since: "2018-05-20" }
    ]
  },
  
  // Données financières historiques
  financial_history: {
    "2021": {
      revenue: 1250000,
      expenses: 1125000,
      net_income: 125000,
      cash: 210000,
      accounts_receivable: 180000,
      accounts_payable: 150000,
      working_capital: 240000,
      debt: 200000,
      equity: 350000,
      quarterly: [
        { quarter: "Q1", revenue: 290000, expenses: 260000, net_income: 30000 },
        { quarter: "Q2", revenue: 310000, expenses: 280000, net_income: 30000 },
        { quarter: "Q3", revenue: 300000, expenses: 275000, net_income: 25000 },
        { quarter: "Q4", revenue: 350000, expenses: 310000, net_income: 40000 }
      ]
    },
    "2022": {
      revenue: 1450000,
      expenses: 1305000,
      net_income: 145000,
      cash: 240000,
      accounts_receivable: 220000,
      accounts_payable: 180000,
      working_capital: 280000,
      debt: 180000,
      equity: 495000,
      quarterly: [
        { quarter: "Q1", revenue: 340000, expenses: 305000, net_income: 35000 },
        { quarter: "Q2", revenue: 360000, expenses: 325000, net_income: 35000 },
        { quarter: "Q3", revenue: 350000, expenses: 315000, net_income: 35000 },
        { quarter: "Q4", revenue: 400000, expenses: 360000, net_income: 40000 }
      ]
    },
    "2023": {
      revenue: 1680000,
      expenses: 1478000,
      net_income: 202000,
      cash: 320000,
      accounts_receivable: 290000,
      accounts_payable: 210000,
      working_capital: 400000,
      debt: 150000,
      equity: 697000,
      quarterly: [
        { quarter: "Q1", revenue: 400000, expenses: 350000, net_income: 50000 },
        { quarter: "Q2", revenue: 420000, expenses: 370000, net_income: 50000 },
        { quarter: "Q3", revenue: 410000, expenses: 365000, net_income: 45000 },
        { quarter: "Q4", revenue: 450000, expenses: 393000, net_income: 57000 }
      ]
    },
    "2024": {
      revenue: 920000, // CA 2024 de référence
      expenses: 828000,
      net_income: 92000, // Marge nette de 10%
      cash: 280000,
      accounts_receivable: 340000,
      accounts_payable: 250000,
      working_capital: 370000,
      debt: 130000,
      equity: 789000,
      quarterly: [
        { quarter: "Q1", revenue: 450000, expenses: 405000, net_income: 45000 },
        { quarter: "Q2", revenue: 470000, expenses: 423000, net_income: 47000 }
      ]
    }
  },
  
  // Ratios clés
  key_ratios: {
    "2021": {
      gross_margin: 0.22,
      net_margin: 0.10,
      debt_to_equity: 0.57,
      current_ratio: 2.6,
      days_sales_outstanding: 52
    },
    "2022": {
      gross_margin: 0.24,
      net_margin: 0.10,
      debt_to_equity: 0.36,
      current_ratio: 2.8,
      days_sales_outstanding: 55
    },
    "2023": {
      gross_margin: 0.26,
      net_margin: 0.12,
      debt_to_equity: 0.22,
      current_ratio: 2.9,
      days_sales_outstanding: 63
    },
    "2024": {
      gross_margin: 0.25,
      net_margin: 0.10, // Marge nette de 10%
      debt_to_equity: 0.16,
      current_ratio: 2.5,
      days_sales_outstanding: 67
    }
  },
  
  // KPIs actuelles (pour tableaux de bord)
  current_kpis: [
    { label: "Chiffre d'affaires", value: "€337k", trend: "+7%", status: "positive" },
    { label: "Marge brute", value: "€198k", trend: "+5%", status: "positive" },
    { label: "Trésorerie", value: "€142k", trend: "-3%", status: "negative" },
    { label: "DSO", value: "42j", trend: "-2j", status: "positive" }
  ],
  
  // Segmentation clients
  client_segments: [
    { segment: "Retail", percentage: 35 },
    { segment: "Services", percentage: 45 },
    { segment: "Industrie", percentage: 15 },
    { segment: "Autres", percentage: 5 }
  ],
  
  // Prédictions
  predictions: [
    { metric: "Chiffre d'affaires Q3", value: "€375k-€410k", confidence: 85 },
    { metric: "Besoin de trésorerie", value: "€35k (Août)", confidence: 76 },
    { metric: "Risque client élevé", value: "2 clients", confidence: 91 }
  ],
  
  // Facteurs de risque
  risk_factors: [
    {
      name: "Augmentation des délais de paiement",
      impact: "medium",
      indicators: ["days_sales_outstanding"],
      trend: "increasing"
    },
    {
      name: "Perte d'un client majeur (>15% CA)",
      impact: "high",
      probability: "low",
      indicators: ["revenue", "net_income"]
    },
    {
      name: "Difficulté de recrutement",
      impact: "medium",
      probability: "high",
      indicators: ["expenses", "revenue_growth"]
    }
  ],
  
  // Opportunités de croissance
  growth_opportunities: [
    {
      name: "Transition vers services cloud",
      potential_revenue: "+15%",
      investment_required: 80000,
      time_to_market: "6 mois",
      absolute_gain: "138,000€" // 15% de 920,000€
    },
    {
      name: "IA et automatisation",
      potential_revenue: "+20%",
      investment_required: 150000,
      time_to_market: "3 mois",
      absolute_gain: "184,000€" // 20% de 920,000€
    },
    {
      name: "Expansion internationale",
      potential_revenue: "+12%",
      investment_required: 280000,
      time_to_market: "12 mois",
      absolute_gain: "110,400€" // 12% de 920,000€
    }
  ]
};

// Données sectorielles
export const sectorData = {
  // Informations générales
  sector: {
    code: "6201Z",
    name: "Programmation informatique",
    companies: 42850,
    total_revenue: 82500000000,
    average_employees: 18
  },
  
  // Moyennes financières historiques
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
  
  // Comparaison par taille d'entreprise
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
  
  // Tendances du marché
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
  
  // Comparaison client vs secteur
  comparison: [
    { 
      metric: "Chiffre d'affaires", 
      clientValue: "337000", 
      sectorMedian: "920000", 
      percentile: 35,
      status: "warning"
    },
    { 
      metric: "Marge nette", 
      clientValue: "15.2%", 
      sectorMedian: "7.4%", 
      percentile: 82,
      status: "success"
    },
    { 
      metric: "DSO", 
      clientValue: "42j", 
      sectorMedian: "52j", 
      percentile: 78,
      status: "success"
    },
    { 
      metric: "Croissance annuelle", 
      clientValue: "7%", 
      sectorMedian: "8.5%", 
      percentile: 45,
      status: "warning"
    }
  ],
  
  // Différences régionales
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
  
  // Évaluation des risques sectoriels
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

// Comparaison client vs secteur unifiée
export const sectoralComparison = [
  { 
    metric: "Chiffre d'affaires", 
    clientValue: "€337k", 
    formattedClientValue: "337 000 €",
    sectorMedian: "€920k", 
    formattedSectorValue: "920 000 €",
    percentile: 35,
    status: "warning",
    trend: "increasing"
  },
  { 
    metric: "Marge nette", 
    clientValue: "15.2%", 
    formattedClientValue: "15,2%",
    sectorMedian: "7.4%", 
    formattedSectorValue: "7,4%",
    percentile: 82,
    status: "success",
    trend: "stable"
  },
  { 
    metric: "DSO", 
    clientValue: "42j", 
    formattedClientValue: "42 jours",
    sectorMedian: "52j", 
    formattedSectorValue: "52 jours",
    percentile: 78,
    status: "success",
    trend: "decreasing"
  },
  { 
    metric: "Croissance annuelle", 
    clientValue: "7%", 
    formattedClientValue: "7,0%",
    sectorMedian: "8.5%", 
    formattedSectorValue: "8,5%",
    percentile: 45,
    status: "warning",
    trend: "increasing"
  },
  { 
    metric: "Trésorerie / CA", 
    clientValue: "19%", 
    formattedClientValue: "19,0%",
    sectorMedian: "15%", 
    formattedSectorValue: "15,0%",
    percentile: 62,
    status: "success",
    trend: "stable"
  },
  { 
    metric: "Taux d'endettement", 
    clientValue: "16%", 
    formattedClientValue: "16,0%",
    sectorMedian: "25%", 
    formattedSectorValue: "25,0%",
    percentile: 72,
    status: "success",
    trend: "decreasing"
  }
]; 