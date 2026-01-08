import {StaticGameData} from "@/utils/gameConfig";

export const gameData: StaticGameData = {
  "edition": "European Football Club Giants",
  "id": "european_football_club_giants",
  "version": "1.0",
  "currency": "EURO",
  "currency_symbol": "€",
  "mortgage_percentage": 25,
  "sell_percentage": 50,
  "terms": {
    "player": "Manager",
    "property": "Football Club",
    "transport": "Tournament",
    "utility": "Income Stream",
    "house": "Training Pitch",
    "hotel": "Youth Academy",
    "property_rent": "Bare Site Rent",
    "transport_rent": "Tournament Fee",
    "utility_rent": "Broadcasting/Merchandise Fee",
    "mortgage": "Financial Restructuring",
    "passing_go": "SEASON KICK-OFF",
    "salary": "Salary",
    "jail": "REHABILITATION CENTER",
    "theft": "INJURY",
    "parking": "RED CARD",
    "income_tax": "FOUL PLAY SANCTION",
    "luxury_tax": "AGENT’S FEE",
    "community_chest": "CLUB FUNDS",
    "chance": "CLUB TOURS"
  },
  "cells": [
    {
      "index": 1,
      "name": "SEASON KICK-OFF",
      "cell_type": "special",
      "cell_sub_type": "Corner",
      "action_keyword": "salary",
      "action_details": "Collect €200 salary"
    },
    {
      "index": 2,
      "name": "Fenerbahçe SK",
      "cell_type": "property",
      "cell_sub_type": "TURKIYE",

      "house_rent": {
        "0": 2,
        "1": 10,
        "2": 30,
        "3": 90,
        "4": 160,
        "5": 250
      },
      "house_price": 50,
      "property_price": 60
    },
    {
      "index": 3,
      "name": "CLUB FUNDS",
      "cell_type": "special",
      "cell_sub_type": "Community Chest",

      "action_keyword": "card"
    },
    {
      "index": 4,
      "name": "Galatasaray SK",
      "cell_type": "property",
      "cell_sub_type": "TURKIYE",

      "house_rent": {
        "0": 4,
        "1": 20,
        "2": 60,
        "3": 180,
        "4": 320,
        "5": 450
      },
      "house_price": 50,
      "property_price": 60
    },
    {
      "index": 5,
      "name": "FOUL PLAY SANCTION",
      "cell_type": "special",
      "cell_sub_type": "Tax",

      "action_keyword": "tax",
      "action_details": "200",
    },
    {
      "index": 6,
      "name": "UEFA Champions League",
      "cell_type": "transport",
      "cell_sub_type": "Transport",

      "transport_rent": {
        "1": 25,
        "2": 50,
        "3": 100,
        "4": 200
      },
      "transport_price": 200
    },
    {
      "index": 7,
      "name": "Sporting CP",
      "cell_type": "property",
      "cell_sub_type": "PORTUGAL",

      "house_rent": {
        "0": 6,
        "1": 30,
        "2": 90,
        "3": 270,
        "4": 400,
        "5": 550
      },
      "house_price": 50,
      "property_price": 100
    },
    {
      "index": 8,
      "name": "CLUB TOURS",
      "cell_type": "special",
      "cell_sub_type": "Chance",

      "action_keyword": "chance"
    },
    {
      "index": 9,
      "name": "FC Porto",
      "cell_type": "property",
      "cell_sub_type": "PORTUGAL",

      "house_rent": {
        "0": 6,
        "1": 30,
        "2": 90,
        "3": 270,
        "4": 400,
        "5": 550
      },
      "house_price": 50,
      "property_price": 100
    },
    {
      "index": 10,
      "name": "Benfica SL",
      "cell_type": "property",
      "cell_sub_type": "PORTUGAL",

      "house_rent": {
        "0": 8,
        "1": 40,
        "2": 100,
        "3": 300,
        "4": 450,
        "5": 600
      },
      "house_price": 50,
      "property_price": 120
    },
    {
      "index": 11,
      "name": "REHABILITATION CENTER",
      "cell_type": "special",
      "cell_sub_type": "Corner",

      "action_keyword": "rest",
      "action_details": "Jail / Just Visiting"
    },
    {
      "index": 12,
      "name": "Feyenoord",
      "cell_type": "property",
      "cell_sub_type": "NETHERLANDS",

      "house_rent": {
        "0": 10,
        "1": 50,
        "2": 150,
        "3": 450,
        "4": 625,
        "5": 750
      },
      "house_price": 100,
      "property_price": 140
    },
    {
      "index": 13,
      "name": "GLOBAL BROADCAST RIGHTS",
      "cell_type": "utility",
      "cell_sub_type": "Utility",

      "utility_rent_multiplier": {
        "1": 4,
        "2": 10
      },
      "property_price": 150
    },
    {
      "index": 14,
      "name": "PSV Eindhoven",
      "cell_type": "property",
      "cell_sub_type": "NETHERLANDS",

      "house_rent": {
        "0": 10,
        "1": 50,
        "2": 150,
        "3": 450,
        "4": 625,
        "5": 750
      },
      "house_price": 100,
      "property_price": 140
    },
    {
      "index": 15,
      "name": "Ajax Amsterdam",
      "cell_type": "property",
      "cell_sub_type": "NETHERLANDS",

      "house_rent": {
        "0": 12,
        "1": 60,
        "2": 180,
        "3": 500,
        "4": 700,
        "5": 900
      },
      "house_price": 100,
      "property_price": 160
    },
    {
      "index": 16,
      "name": "UEFA Europa League",
      "cell_type": "transport",
      "cell_sub_type": "Transport",

      "transport_rent": {
        "1": 25,
        "2": 50,
        "3": 100,
        "4": 200
      },
      "transport_price": 200
    },
    {
      "index": 17,
      "name": "Olympique Lyonnais",
      "cell_type": "property",
      "cell_sub_type": "FRANCE",

      "house_rent": {
        "0": 14,
        "1": 70,
        "2": 200,
        "3": 550,
        "4": 750,
        "5": 950
      },
      "house_price": 100,
      "property_price": 180
    },
    {
      "index": 18,
      "name": "CLUB FUNDS",
      "cell_type": "special",
      "cell_sub_type": "Community Chest",

      "action_keyword": "card"
    },
    {
      "index": 19,
      "name": "AS Monaco",
      "cell_type": "property",
      "cell_sub_type": "FRANCE",

      "house_rent": {
        "0": 14,
        "1": 70,
        "2": 200,
        "3": 550,
        "4": 750,
        "5": 950
      },
      "house_price": 100,
      "property_price": 180
    },
    {
      "index": 20,
      "name": "Paris Saint-Germain",
      "cell_type": "property",
      "cell_sub_type": "FRANCE",

      "house_rent": {
        "0": 16,
        "1": 80,
        "2": 220,
        "3": 600,
        "4": 800,
        "5": 1000
      },
      "house_price": 100,
      "property_price": 200
    },
    {
      "index": 21,
      "name": "RED CARD",
      "cell_type": "special",
      "cell_sub_type": "Corner",

      "action_keyword": "rest",
      "action_details": "Rest/Sit Out One Match (Free Parking)"
    },
    {
      "index": 22,
      "name": "AC Milan",
      "cell_type": "property",
      "cell_sub_type": "ITALY",

      "house_rent": {
        "0": 18,
        "1": 90,
        "2": 250,
        "3": 700,
        "4": 875,
        "5": 1050
      },
      "house_price": 150,
      "property_price": 220
    },
    {
      "index": 23,
      "name": "CLUB TOURS",
      "cell_type": "special",
      "cell_sub_type": "Chance",

      "action_keyword": "chance"
    },
    {
      "index": 24,
      "name": "Inter Milan",
      "cell_type": "property",
      "cell_sub_type": "ITALY",

      "house_rent": {
        "0": 18,
        "1": 90,
        "2": 250,
        "3": 700,
        "4": 875,
        "5": 1050
      },
      "house_price": 150,
      "property_price": 220
    },
    {
      "index": 25,
      "name": "Juventus FC",
      "cell_type": "property",
      "cell_sub_type": "ITALY",

      "house_rent": {
        "0": 20,
        "1": 100,
        "2": 300,
        "3": 750,
        "4": 925,
        "5": 1100
      },
      "house_price": 150,
      "property_price": 240
    },
    {
      "index": 26,
      "name": "UEFA Conference League",
      "cell_type": "transport",
      "cell_sub_type": "Transport",

      "transport_rent": {
        "1": 25,
        "2": 50,
        "3": 100,
        "4": 200
      },
      "transport_price": 200
    },
    {
      "index": 27,
      "name": "Borussia Dortmund",
      "cell_type": "property",
      "cell_sub_type": "GERMANY",

      "house_rent": {
        "0": 22,
        "1": 110,
        "2": 330,
        "3": 800,
        "4": 975,
        "5": 1150
      },
      "house_price": 150,
      "property_price": 260
    },
    {
      "index": 28,
      "name": "Bayer Leverkusen",
      "cell_type": "property",
      "cell_sub_type": "GERMANY",

      "house_rent": {
        "0": 22,
        "1": 110,
        "2": 330,
        "3": 800,
        "4": 975,
        "5": 1150
      },
      "house_price": 150,
      "property_price": 260
    },
    {
      "index": 29,
      "name": "KIT & MERCHANDISE SALES",
      "cell_type": "utility",
      "cell_sub_type": "Utility",

      "utility_rent_multiplier": {
        "1": 4,
        "2": 10
      },
      "property_price": 150
    },
    {
      "index": 30,
      "name": "Bayern Munich",
      "cell_type": "property",
      "cell_sub_type": "GERMANY",

      "house_rent": {
        "0": 24,
        "1": 120,
        "2": 360,
        "3": 850,
        "4": 1025,
        "5": 1200
      },
      "house_price": 150,
      "property_price": 280
    },
    {
      "index": 31,
      "name": "INJURY",
      "cell_type": "special",
      "cell_sub_type": "Corner",

      "action_keyword": "jail",
      "action_details": "Go Directly to REHABILITATION CENTER"
    },
    {
      "index": 32,
      "name": "Liverpool FC",
      "cell_type": "property",
      "cell_sub_type": "ENGLAND",

      "house_rent": {
        "0": 26,
        "1": 130,
        "2": 390,
        "3": 900,
        "4": 1100,
        "5": 1275
      },
      "house_price": 200,
      "property_price": 300
    },
    {
      "index": 33,
      "name": "Chelsea FC",
      "cell_type": "property",
      "cell_sub_type": "ENGLAND",

      "house_rent": {
        "0": 26,
        "1": 130,
        "2": 390,
        "3": 900,
        "4": 1100,
        "5": 1275
      },
      "house_price": 200,
      "property_price": 300
    },
    {
      "index": 34,
      "name": "CLUB FUNDS",
      "cell_type": "special",
      "cell_sub_type": "Community Chest",

      "action_keyword": "card"
    },
    {
      "index": 35,
      "name": "Arsenal FC",
      "cell_type": "property",
      "cell_sub_type": "ENGLAND",

      "house_rent": {
        "0": 28,
        "1": 150,
        "2": 450,
        "3": 1000,
        "4": 1200,
        "5": 1400
      },
      "house_price": 200,
      "property_price": 320
    },
    {
      "index": 36,
      "name": "FIFA Club World Cup",
      "cell_type": "transport",
      "cell_sub_type": "Transport",

      "transport_rent": {
        "1": 25,
        "2": 50,
        "3": 100,
        "4": 200
      },
      "transport_price": 200
    },
    {
      "index": 37,
      "name": "CLUB TOURS",
      "cell_type": "special",
      "cell_sub_type": "Chance",

      "action_keyword": "chance"
    },
    {
      "index": 38,
      "name": "FC Barcelona",
      "cell_type": "property",
      "cell_sub_type": "SPAIN",

      "house_rent": {
        "0": 35,
        "1": 175,
        "2": 500,
        "3": 1100,
        "4": 1300,
        "5": 1500
      },
      "house_price": 200,
      "property_price": 350
    },
    {
      "index": 39,
      "name": "AGENT’S FEE",
      "cell_type": "special",
      "cell_sub_type": "Tax",

      "action_keyword": "tax",
      "action_details": "100",
    },
    {
      "index": 40,
      "name": "Real Madrid",
      "cell_type": "property",
      "cell_sub_type": "SPAIN",

      "house_rent": {
        "0": 50,
        "1": 200,
        "2": 600,
        "3": 1400,
        "4": 1700,
        "5": 2000
      },
      "house_price": 200,
      "property_price": 400
    }
  ],
  logos:  {
    // Property/Club logos - high-quality sources from Wikimedia
    'Fenerbahçe SK': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Fenerbah%C3%A7e_Spor_Kul%C3%BCb%C3%BC_%28logo%2C_1923%29.svg',
    'Galatasaray SK': 'https://upload.wikimedia.org/wikipedia/fr/b/bd/Logo_Galatasaray_SK_2023.svg',
    'Sporting CP': 'https://upload.wikimedia.org/wikipedia/fr/f/fd/Logo_Sporting_CP_2001.svg',
    'Benfica SL': 'https://upload.wikimedia.org/wikipedia/sco/a/a2/SL_Benfica_logo.svg',
    'FC Porto': 'https://upload.wikimedia.org/wikipedia/sco/f/f1/FC_Porto.svg',
    'Feyenoord': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Feyenoord_logo_since_2024.svg',
    'Ajax Amsterdam': 'https://upload.wikimedia.org/wikipedia/sco/7/79/Ajax_Amsterdam.svg',
    'PSV Eindhoven': 'https://upload.wikimedia.org/wikipedia/sco/0/05/PSV_Eindhoven.svg',
    'Olympique Lyonnais': 'https://upload.wikimedia.org/wikipedia/fr/a/a5/Logo_Olympique_Lyonnais_-_2022.svg',
    'Paris Saint-Germain': 'https://upload.wikimedia.org/wikipedia/sco/a/a7/Paris_Saint-Germain_F.C..svg',
    'Paris Saint-Germain (PSG)': 'https://upload.wikimedia.org/wikipedia/sco/a/a7/Paris_Saint-Germain_F.C..svg',
    'AS Monaco': 'https://upload.wikimedia.org/wikipedia/fr/1/1d/Logo_AS_Monaco_FC_2021.svg',
    'AC Milan': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
    'Inter Milan': 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
    'Juventus FC': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Juventus_FC_-_logo_black_%28Italy%2C_2017%29.svg',
    'Borussia Dortmund': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
    'Bayer Leverkusen': 'https://upload.wikimedia.org/wikipedia/sco/5/59/Bayer_04_Leverkusen_logo.svg',
    'Bayern Munich': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Logo_FC_Bayern_M%C3%BCnchen_%282002%E2%80%932017%29.svg',
    'Liverpool FC': 'https://upload.wikimedia.org/wikipedia/sco/0/0c/Liverpool_FC.svg',
    'Chelsea FC': 'https://upload.wikimedia.org/wikipedia/sco/c/cc/Chelsea_FC.svg',
    'Arsenal FC': 'https://upload.wikimedia.org/wikipedia/sco/5/53/Arsenal_FC.svg',
    'Real Madrid': 'https://upload.wikimedia.org/wikipedia/sco/5/56/Real_Madrid_CF.svg',
    'FC Barcelona': 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',

    // Transport spaces - UEFA tournament logos
    'UEFA Champions League': 'https://upload.wikimedia.org/wikipedia/en/f/f5/UEFA_Champions_League.svg',
    'UEFA Europa League': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/UEFA_Europa_League_logo_%282024_version%29.svg',
    'UEFA Conference League': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/UEFA_Conference_League_full_logo_%282024_version%29.svg',
    'FIFA Club World Cup': 'https://upload.wikimedia.org/wikipedia/en/1/1d/2014_FIFA_World_Cup.svg',

    // Utility spaces - can add custom icons
    // 'GLOBAL BROADCAST RIGHTS': 'https://your-cdn.com/broadcast-icon.svg',
    // 'KIT & MERCHANDISE SALES': 'https://your-cdn.com/merchandise-icon.svg',

    // Card spaces - can add custom icons
    // 'CLUB FUNDS': 'https://your-cdn.com/club-funds-icon.svg',
    // 'CLUB TOURS': 'https://your-cdn.com/club-tours-icon.svg',

    // Corner/Special spaces - can add custom icons
    'SEASON KICK-OFF': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Whistle_icon.svg',
    'REHABILITATION CENTER': 'https://upload.wikimedia.org/wikipedia/commons/1/11/Farmacia_Online.svg',
    'RED CARD': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Red_card.svg',
    'INJURY': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_plus_sign.svg',
    // 'FOUL PLAY SANCTION': 'https://your-cdn.com/foul-icon.svg',
    // "AGENT'S FEE": 'https://your-cdn.com/agent-fee-icon.svg',
  },
  subTypeColors:  {
    // Property countries
    'TURKIYE': { primary: '#9F1239', secondary: '#881337', gradient: 'from-rose-800 to-rose-900', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg' },
    'PORTUGAL': { primary: '#0EA5E9', secondary: '#0284C7', gradient: 'from-sky-500 to-sky-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg' },
    'NETHERLANDS': { primary: '#EA580C', secondary: '#C2410C', gradient: 'from-orange-600 to-orange-700', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg' },
    'FRANCE': { primary: '#FB7185', secondary: '#F43F5E', gradient: 'from-rose-400 to-rose-500', logo: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg' },
    'ITALY': { primary: '#0284C7', secondary: '#0369A1', gradient: 'from-sky-600 to-sky-700', logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg' },
    'GERMANY': { primary: '#DC2626', secondary: '#991B1B', gradient: 'from-red-600 to-red-700', logo: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg' },
    'ENGLAND': { primary: '#7C3AED', secondary: '#6D28D9', gradient: 'from-violet-600 to-violet-700', logo: 'https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg' },
    'SPAIN': { primary: '#CA8A04', secondary: '#A16207', gradient: 'from-yellow-600 to-yellow-700', logo: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg' },

    // Transport
    'Transport': { primary: '#F59E0B', secondary: '#D97706', gradient: 'from-amber-500 to-amber-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Trophy_icon.svg' },

    // Utility
    'Utility': { primary: '#3B82F6', secondary: '#2563EB', gradient: 'from-blue-500 to-blue-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Electricity_icon.svg' },

    // Special/Card types
    'Community Chest': { primary: '#F97316', secondary: '#EA580C', gradient: 'from-orange-500 to-orange-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Gift_icon.svg' },
    'Chance': { primary: '#EC4899', secondary: '#DB2777', gradient: 'from-pink-500 to-pink-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Question_mark_icon.svg' },
    'Tax': { primary: '#EF4444', secondary: '#DC2626', gradient: 'from-red-500 to-red-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Dollar_sign_icon.svg' },
  },

  // Individual corner configurations - each corner can have different colors
  cornerColors: {
    'SEASON KICK-OFF': {
      primary: '#F59E0B',
      secondary: '#D97706',
      gradient: 'from-amber-400 to-amber-600',
      logo: null,
      textColor: '#92400E'
    },
    'REHABILITATION CENTER': {
      primary: '#F59E0B',
      secondary: '#D97706',
      gradient: 'from-amber-400 to-amber-600',
      logo: null,
      textColor: '#92400E'
    },
    'RED CARD': {
      primary: '#F59E0B',
      secondary: '#D97706',
      gradient: 'from-amber-400 to-amber-600',
      logo: null,
      textColor: '#92400E'
    },
    'INJURY': {
      primary: '#F59E0B',
      secondary: '#D97706',
      gradient: 'from-amber-400 to-amber-600',
      logo: null,
      textColor: '#92400E'
    },
  },
}
