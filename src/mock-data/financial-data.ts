/**
 * Données financières simulées pour les démonstrations
 * Ces données représentent un historique financier simplifié 
 * pour une entreprise fictive de services informatiques
 */

export const mockFinancialData = {
  company: {
    name: "InfoTech Solutions",
    siren: "123456789",
    sector: "6201Z - Programmation informatique",
    creation_date: "2017-03-15",
    employees: 24
  },
  financial_history: [
    {
      year: 2021,
      data: {
        revenue: 1250000,
        expenses: 1125000,
        net_income: 125000,
        cash: 210000,
        accounts_receivable: 180000,
        accounts_payable: 150000,
        working_capital: 240000,
        debt: 200000,
        equity: 350000
      },
      quarterly: [
        { quarter: "Q1", revenue: 290000, expenses: 260000, net_income: 30000 },
        { quarter: "Q2", revenue: 310000, expenses: 280000, net_income: 30000 },
        { quarter: "Q3", revenue: 300000, expenses: 275000, net_income: 25000 },
        { quarter: "Q4", revenue: 350000, expenses: 310000, net_income: 40000 }
      ]
    },
    {
      year: 2022,
      data: {
        revenue: 1450000,
        expenses: 1305000,
        net_income: 145000,
        cash: 240000,
        accounts_receivable: 220000,
        accounts_payable: 180000,
        working_capital: 280000,
        debt: 180000,
        equity: 495000
      },
      quarterly: [
        { quarter: "Q1", revenue: 340000, expenses: 305000, net_income: 35000 },
        { quarter: "Q2", revenue: 360000, expenses: 325000, net_income: 35000 },
        { quarter: "Q3", revenue: 350000, expenses: 315000, net_income: 35000 },
        { quarter: "Q4", revenue: 400000, expenses: 360000, net_income: 40000 }
      ]
    },
    {
      year: 2023,
      data: {
        revenue: 1680000,
        expenses: 1478000,
        net_income: 202000,
        cash: 320000,
        accounts_receivable: 290000,
        accounts_payable: 210000,
        working_capital: 400000,
        debt: 150000,
        equity: 697000
      },
      quarterly: [
        { quarter: "Q1", revenue: 400000, expenses: 350000, net_income: 50000 },
        { quarter: "Q2", revenue: 420000, expenses: 370000, net_income: 50000 },
        { quarter: "Q3", revenue: 410000, expenses: 365000, net_income: 45000 },
        { quarter: "Q4", revenue: 450000, expenses: 393000, net_income: 57000 }
      ]
    },
    {
      year: 2024,
      data: {
        revenue: 920000, // YTD (6 mois)
        expenses: 828000,
        net_income: 92000,
        cash: 280000,
        accounts_receivable: 340000,
        accounts_payable: 250000,
        working_capital: 370000,
        debt: 130000,
        equity: 789000
      },
      quarterly: [
        { quarter: "Q1", revenue: 450000, expenses: 405000, net_income: 45000 },
        { quarter: "Q2", revenue: 470000, expenses: 423000, net_income: 47000 }
      ]
    }
  ],
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
      net_margin: 0.10,
      debt_to_equity: 0.16,
      current_ratio: 2.5,
      days_sales_outstanding: 67
    }
  },
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
  growth_opportunities: [
    {
      name: "Transition vers services cloud",
      potential_revenue: "+25%",
      investment_required: 120000,
      time_to_market: "6 mois"
    },
    {
      name: "IA et automatisation",
      potential_revenue: "+15%",
      investment_required: 80000,
      time_to_market: "3 mois"
    }
  ]
}; 