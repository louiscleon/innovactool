// Données mock pour la vue ClientProfileView

export const mockClientData = {
  legalInfo: {
    name: "TechInnovate SAS",
    siren: "789456123",
    legalForm: "Société par Actions Simplifiée",
    creationDate: "15/03/2015",
    address: "23 rue de l'Innovation, 75008 Paris",
    capital: 150000,
    directors: [
      {
        id: "dir1",
        name: "Sophie Dubois",
        role: "Présidente",
        since: "15/03/2015",
        otherMandates: ["DigitalSoft SARL", "InvestTech SAS"]
      },
      {
        id: "dir2",
        name: "Thomas Martin",
        role: "Directeur Général",
        since: "10/05/2018",
        otherMandates: []
      },
      {
        id: "dir3",
        name: "Laurent Chen",
        role: "Directeur Technique",
        since: "01/09/2019",
        otherMandates: ["DevLabs SAS"]
      }
    ]
  },
  financialInfo: {
    revenue: 2840000,
    revenue_trend: "up",
    operating_profit: 487000,
    operating_margin: 0.1714,
    net_profit: 356000,
    net_margin: 0.1253,
    cash: 790000,
    equity: 1240000,
    debt: 460000,
    wc_requirement: 380000
  },
  sectorPosition: {
    sector: "Services informatiques",
    naf_code: "6201Z",
    ranking: 157,
    total_companies: 8425,
    growth_percentile: 82,
    profitability_percentile: 76,
    financial_health_score: 85
  },
  news: [
    {
      id: "news1",
      date: "12/05/2024",
      title: "TechInnovate remporte un prix d'innovation au salon Tech Paris 2024",
      source: "Journal du Numérique",
      type: "company",
      impact: "positive"
    },
    {
      id: "news2",
      date: "28/04/2024",
      title: "Nouveau cadre réglementaire pour les services cloud en Europe",
      source: "Les Échos",
      type: "regulatory",
      impact: "neutral"
    },
    {
      id: "news3",
      date: "15/04/2024",
      title: "Pénurie de talents IT : le secteur fait face à des tensions de recrutement",
      source: "Le Monde Informatique",
      type: "sector",
      impact: "negative"
    },
    {
      id: "news4",
      date: "02/04/2024",
      title: "TechInnovate ouvre un nouveau bureau à Lyon",
      source: "La Tribune",
      type: "company",
      impact: "positive"
    }
  ],
  recommendedMissions: [
    {
      id: "mission1",
      title: "Optimisation de la structure financière",
      description: "Analyse de la structure de financement actuelle et proposition de scénarios d'optimisation du ratio d'endettement et des charges financières.",
      benefit: "Réduction des charges financières de 15-20%",
      relevance: 5,
      type: "financial"
    },
    {
      id: "mission2",
      title: "Accompagnement à l'expansion géographique",
      description: "Support financier, fiscal et juridique pour sécuriser l'ouverture des nouveaux bureaux et la structuration de l'activité multi-sites.",
      benefit: "Sécurisation juridique et fiscale de l'expansion",
      relevance: 4,
      type: "strategic"
    },
    {
      id: "mission3",
      title: "Mise en place d'un reporting financier avancé",
      description: "Conception et implémentation d'un tableau de bord financier précis avec KPIs sectoriels adaptés et système d'alerte prédictif.",
      benefit: "Amélioration de la prise de décision stratégique",
      relevance: 3,
      type: "operational"
    }
  ]
};

export const mockSectoralGaps = {
  sector: "Services informatiques",
  companyName: "TechInnovate SAS",
  gaps: [
    {
      id: "gap1",
      account: "641000",
      description: "Charges de personnel",
      amount: 1240000,
      sectorAverage: 980000,
      gap: 260000,
      gapPercent: 26.5,
      status: "above",
      criticality: "high",
      causes: [
        "Structure d'encadrement plus importante que la moyenne sectorielle",
        "Politique salariale attractive pour attirer les talents",
        "Turnover inférieur à la moyenne, mais ancienneté moyenne plus élevée"
      ],
      recommendations: [
        "Analyser le ratio d'encadrement vs. opérationnels",
        "Revoir la structure des rémunérations variables",
        "Optimiser les charges sociales via des dispositifs d'épargne salariale"
      ]
    },
    {
      id: "gap2",
      account: "606000",
      description: "Achats non stockés",
      amount: 85000,
      sectorAverage: 45000,
      gap: 40000,
      gapPercent: 88.9,
      status: "above",
      criticality: "medium",
      causes: [
        "Coûts des licences logicielles supérieurs à la moyenne sectorielle",
        "Consommables informatiques en quantité élevée"
      ],
      recommendations: [
        "Renégocier les contrats de licences logicielles",
        "Évaluer la pertinence d'une politique d'achat centralisée"
      ]
    },
    {
      id: "gap3",
      account: "615000",
      description: "Entretien et réparation",
      amount: 28000,
      sectorAverage: 42000,
      gap: -14000,
      gapPercent: -33.3,
      status: "below",
      criticality: "low",
      causes: [
        "Parc informatique récent nécessitant moins de maintenance",
        "Contrats de maintenance optimisés"
      ],
      recommendations: [
        "Maintenir la politique de renouvellement régulier du matériel",
        "Documenter les pratiques pour capitaliser sur cette optimisation"
      ]
    },
    {
      id: "gap4",
      account: "622600",
      description: "Honoraires",
      amount: 210000,
      sectorAverage: 120000,
      gap: 90000,
      gapPercent: 75.0,
      status: "above",
      criticality: "medium",
      causes: [
        "Recours élevé à des consultants externes",
        "Frais juridiques importants liés à la protection de la propriété intellectuelle"
      ],
      recommendations: [
        "Évaluer l'internalisation de certaines compétences clés",
        "Négocier des forfaits annuels avec les cabinets de conseil"
      ]
    }
  ]
};

export const mockMissionProposals = [
  {
    id: "mp1",
    title: "Optimisation de la structure de financement",
    description: "Analyse détaillée de la structure financière actuelle et définition d'une stratégie d'optimisation du ratio d'endettement pour améliorer la rentabilité des capitaux propres tout en sécurisant la trésorerie.",
    signalType: "financial",
    confidence: 92,
    benefits: [
      "Réduction des frais financiers de 15-20%",
      "Amélioration du ROE de 2-3 points",
      "Sécurisation des lignes de crédit pour les 3 prochaines années",
      "Préparation financière pour les projets d'expansion"
    ],
    estimatedFees: {
      min: 8500,
      max: 12000
    },
    timeline: {
      totalDuration: "10-12 semaines",
      stages: [
        {
          name: "Diagnostic financier approfondi",
          duration: "3 semaines",
          description: "Analyse complète de la structure financière actuelle, modélisation des flux et simulation de scénarios"
        },
        {
          name: "Construction des scénarios d'optimisation",
          duration: "4 semaines",
          description: "Élaboration de 3-4 scénarios détaillés avec chiffrage des impacts et analyse des risques"
        },
        {
          name: "Accompagnement à la mise en œuvre",
          duration: "3-5 semaines",
          description: "Support opérationnel pour les négociations bancaires et la restructuration des financements"
        }
      ]
    },
    requirements: [
      {
        id: "req1",
        name: "Finance d'entreprise",
        importance: "essential"
      },
      {
        id: "req2",
        name: "Ingénierie financière",
        importance: "essential"
      },
      {
        id: "req3",
        name: "Modélisation financière",
        importance: "recommended"
      },
      {
        id: "req4",
        name: "Relations bancaires",
        importance: "recommended"
      }
    ],
    triggeredBy: [
      {
        id: "sig1",
        description: "Ratio d'endettement net supérieur de 42% à la médiane sectorielle",
        type: "financial",
        severity: "high",
        confidence: 97
      },
      {
        id: "sig2",
        description: "Coût moyen de la dette 1.8 points au-dessus des références sectorielles",
        type: "financial",
        severity: "medium",
        confidence: 88
      }
    ],
    justification: "Cette mission est particulièrement pertinente maintenant compte tenu du niveau historiquement bas des taux d'intérêt pour les entreprises de votre secteur et taille. L'analyse des FEC a révélé un potentiel d'économie significatif sur vos frais financiers. De plus, la restructuration des dettes permettrait de libérer des capitaux pour vos projets d'expansion à Lyon tout en optimisant votre fiscalité."
  },
  {
    id: "mp2",
    title: "Accompagnement au crédit d'impôt recherche",
    description: "Mise en place d'un dispositif complet de captation, documentation et optimisation du crédit d'impôt recherche (CIR) adapté aux activités de développement logiciel de TechInnovate.",
    signalType: "fiscal",
    confidence: 88,
    benefits: [
      "Récupération estimée entre 120K€ et 180K€ par an",
      "Sécurisation juridique et fiscale des dossiers CIR",
      "Réduction du risque de redressement fiscal",
      "Optimisation du périmètre éligible"
    ],
    estimatedFees: {
      min: 12000,
      max: 18000
    },
    timeline: {
      totalDuration: "6-8 mois",
      stages: [
        {
          name: "Diagnostic d'éligibilité",
          duration: "4 semaines",
          description: "Analyse des projets de R&D et qualification des dépenses potentiellement éligibles"
        },
        {
          name: "Mise en place du système de captation",
          duration: "8 semaines",
          description: "Définition et implémentation des processus de documentation technique et financière"
        },
        {
          name: "Préparation du dossier CIR",
          duration: "6 semaines",
          description: "Élaboration des justificatifs scientifiques et financiers conformes aux exigences de l'administration"
        },
        {
          name: "Formation et autonomisation",
          duration: "4 semaines",
          description: "Transfert de compétences pour pérenniser le dispositif en interne"
        }
      ]
    },
    requirements: [
      {
        id: "req5",
        name: "Fiscalité R&D",
        importance: "essential"
      },
      {
        id: "req6",
        name: "Ingénierie fiscale",
        importance: "essential"
      },
      {
        id: "req7",
        name: "Connaissance IT",
        importance: "recommended"
      },
      {
        id: "req8",
        name: "Gestion de projet",
        importance: "optional"
      }
    ],
    triggeredBy: [
      {
        id: "sig3",
        description: "Dépenses R&D identifiées non déclarées au CIR (environ 450K€)",
        type: "fiscal",
        severity: "high",
        confidence: 85
      },
      {
        id: "sig4",
        description: "Absence de mécanisme formel de documentation R&D",
        type: "legal",
        severity: "medium",
        confidence: 90
      }
    ],
    justification: "L'analyse croisée de vos comptes et des activités de votre entreprise montre un potentiel inexploité très significatif en matière de crédit d'impôt recherche. Plusieurs de vos projets de développement correspondent aux critères d'éligibilité définis par l'administration fiscale. Cependant, l'absence de documentation structurée et de système de captation vous empêche actuellement de bénéficier de ce dispositif fiscal très avantageux, adapté à votre profil d'entreprise innovante."
  },
  {
    id: "mp3",
    title: "Pilotage prédictif du BFR",
    description: "Conception et mise en place d'un système de prévision et de gestion dynamique du besoin en fonds de roulement, intégrant les spécificités saisonnières et sectorielles.",
    signalType: "performance",
    confidence: 82,
    benefits: [
      "Réduction du BFR de 15-20% à horizon 12 mois",
      "Amélioration de la trésorerie de 60-80K€",
      "Sécurisation des périodes de tension prévisibles",
      "Optimisation des négociations fournisseurs et clients"
    ],
    estimatedFees: {
      min: 7500,
      max: 10000
    },
    timeline: {
      totalDuration: "8-10 semaines",
      stages: [
        {
          name: "Analyse des cycles d'exploitation",
          duration: "3 semaines",
          description: "Étude approfondie des cycles clients, stocks et fournisseurs"
        },
        {
          name: "Modélisation prédictive",
          duration: "3 semaines",
          description: "Développement d'un modèle de prévision du BFR intégrant les facteurs saisonniers"
        },
        {
          name: "Implémentation des tableaux de bord",
          duration: "2 semaines",
          description: "Mise en place des outils de pilotage avec alertes précoces"
        },
        {
          name: "Formation et accompagnement",
          duration: "2 semaines",
          description: "Transfert de compétences et définition des processus de suivi"
        }
      ]
    },
    requirements: [
      {
        id: "req9",
        name: "Analyse financière",
        importance: "essential"
      },
      {
        id: "req10",
        name: "Modélisation BFR",
        importance: "essential"
      },
      {
        id: "req11",
        name: "Connaissance sectorielle",
        importance: "recommended"
      },
      {
        id: "req12",
        name: "Recouvrement",
        importance: "optional"
      }
    ],
    triggeredBy: [
      {
        id: "sig5",
        description: "Variation saisonnière du BFR de 35% identifiée sur les 24 derniers mois",
        type: "performance",
        severity: "medium",
        confidence: 84
      },
      {
        id: "sig6",
        description: "DSO supérieur de 12 jours à la médiane sectorielle",
        type: "performance",
        severity: "medium",
        confidence: 92
      }
    ],
    justification: "L'analyse des cycles d'exploitation sur les trois derniers exercices révèle des tensions de trésorerie récurrentes et prévisibles que votre entreprise pourrait mieux anticiper. En outre, le démarrage de votre nouvelle activité à Lyon va temporairement accroître votre BFR. Nous avons identifié un potentiel d'optimisation de 60-80K€ à court terme, sans impact sur vos relations commerciales, grâce à la mise en place d'outils de pilotage adaptés et de processus de gestion proactive."
  }
];

export const mockODProposals = [
  {
    id: "od1",
    description: "Reclassement d'une immobilisation comptabilisée en charges",
    date: "30/06/2024",
    entries: [
      {
        account: "218300",
        label: "Matériel informatique",
        debit: 3250.00
      },
      {
        account: "445620",
        label: "TVA déductible sur immobilisations",
        debit: 650.00
      },
      {
        account: "606800",
        label: "Autres achats non stockés",
        credit: 3900.00
      }
    ],
    justification: "Le serveur de développement d'une valeur de 3250€ HT a été comptabilisé à tort en charges alors qu'il s'agit d'un bien destiné à servir durablement à l'activité (>1 an). Conformément aux articles 211-1 et 212-1 du PCG, ce matériel doit être immobilisé et amorti sur sa durée d'utilisation prévue.",
    anomalyId: "ano1",
    impact: {
      balance_sheet: "Augmentation des immobilisations corporelles de 3250€ HT",
      income_statement: "Diminution des charges d'exploitation de 3250€ HT",
      tax: "Étalement de la déduction fiscale sur la durée d'amortissement"
    },
    reference: "PCG art. 211-1, 212-1, 214-1 à 214-17"
  },
  {
    id: "od2",
    description: "Correction d'une erreur de taux de TVA sur facture fournisseur",
    date: "30/06/2024",
    entries: [
      {
        account: "445620",
        label: "TVA déductible sur biens et services",
        debit: 150.00
      },
      {
        account: "401000",
        label: "Fournisseurs",
        credit: 150.00
      }
    ],
    justification: "La facture n°F24-0387 du fournisseur Digi-Services a été comptabilisée avec un taux de TVA de 10% au lieu de 20% sur une prestation de service standard. Il convient de corriger la TVA déductible pour éviter un risque fiscal lors d'un éventuel contrôle.",
    anomalyId: "ano2",
    impact: {
      balance_sheet: "Augmentation des créances fiscales de 150€",
      income_statement: "Pas d'impact sur le résultat",
      tax: "Augmentation de la TVA déductible de 150€"
    },
    reference: "CGI art. 278"
  },
  {
    id: "od3",
    description: "Provision pour dépréciation client douteux",
    date: "30/06/2024",
    entries: [
      {
        account: "681740",
        label: "Dotation aux provisions pour dépréciation des créances",
        debit: 4800.00
      },
      {
        account: "491000",
        label: "Provision pour dépréciation des comptes clients",
        credit: 4800.00
      }
    ],
    justification: "Le client Digital Solutions présente un retard de paiement de plus de 120 jours sur une facture de 6000€ TTC (soit 5000€ HT). Après analyse de sa situation financière et des échanges récents, il existe un risque significatif de non-recouvrement estimé à 80% du montant HT, justifiant la comptabilisation d'une provision.",
    anomalyId: "ano3",
    impact: {
      balance_sheet: "Diminution de la valeur nette des créances clients de 4800€",
      income_statement: "Augmentation des charges d'exploitation de 4800€",
      tax: "Déduction fiscale temporaire de 4800€ (réintégration lors de la reprise)"
    },
    reference: "PCG art. 214-25, BOI-BIC-PROV-30-10"
  }
];