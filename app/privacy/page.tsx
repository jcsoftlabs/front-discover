'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Globe, FileText, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const sections = [
    {
      id: 1,
      icon: Users,
      title: "1. Qui sommes-nous ?",
      content: (
        <>
          <p className="mb-4">
            Touris App est une initiative du Ministère du Tourisme d'Haïti, visant à promouvoir les destinations touristiques du pays et à offrir un espace numérique aux établissements du secteur (hôtels, restaurants, sites culturels, etc.).
          </p>
          <p className="mb-4">Notre plateforme permet :</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>aux visiteurs et touristes de découvrir et consulter des informations touristiques ;</li>
            <li>aux partenaires d'inscrire et de gérer leurs établissements ;</li>
            <li>aux administrateurs de superviser et d'assurer la qualité des données affichées.</li>
          </ul>
        </>
      )
    },
    {
      id: 2,
      icon: Database,
      title: "2. Données que nous collectons",
      content: (
        <>
          <p className="mb-4">
            Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services, dans les cas suivants :
          </p>
          
          <h4 className="font-semibold text-gray-900 mb-2">a) Données fournies volontairement</h4>
          <p className="mb-3">Lorsque vous créez un compte, réservez un service ou contactez le support :</p>
          <ul className="list-disc pl-6 space-y-1 mb-4 text-gray-700">
            <li>nom, prénom ;</li>
            <li>adresse e-mail ;</li>
            <li>numéro de téléphone (facultatif) ;</li>
            <li>langue préférée ;</li>
            <li>pays ou ville de résidence ;</li>
            <li>informations relatives à votre établissement (pour les partenaires).</li>
          </ul>

          <h4 className="font-semibold text-gray-900 mb-2">b) Données collectées automatiquement</h4>
          <p className="mb-3">Lors de votre visite sur le site ou de l'utilisation de l'application :</p>
          <ul className="list-disc pl-6 space-y-1 mb-4 text-gray-700">
            <li>type d'appareil et navigateur utilisé ;</li>
            <li>adresse IP partielle (anonymisée) ;</li>
            <li>pages consultées et temps de visite ;</li>
            <li>langue du navigateur ;</li>
            <li>zone géographique approximative (ville/pays, jamais localisation GPS exacte) ;</li>
            <li>informations d'usage (clics, navigation, fréquence d'ouverture de l'app).</li>
          </ul>
          <p className="mb-4">Ces données sont collectées de manière anonyme pour améliorer nos services et nos performances.</p>

          <h4 className="font-semibold text-gray-900 mb-2">c) Données optionnelles</h4>
          <p className="mb-3">Avec votre consentement explicite, nous pouvons collecter :</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>vos préférences de recherche touristique (type d'activité, région, période) ;</li>
            <li>des statistiques d'usage anonymisées pour l'amélioration de l'expérience utilisateur.</li>
          </ul>
        </>
      )
    },
    {
      id: 3,
      icon: Eye,
      title: "3. Finalité de la collecte",
      content: (
        <>
          <p className="mb-4">Les données collectées sont utilisées pour :</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>assurer le bon fonctionnement technique de la plateforme ;</li>
            <li>améliorer la navigation et personnaliser le contenu affiché ;</li>
            <li>faciliter les interactions entre utilisateurs, partenaires et administrateurs ;</li>
            <li>fournir des statistiques d'usage anonymisées pour le Ministère du Tourisme ;</li>
            <li>garantir la sécurité des comptes et prévenir les abus ;</li>
            <li>communiquer avec vous (notifications, assistance, mises à jour).</li>
          </ul>
          <p className="mt-4 font-semibold text-gray-900">
            Nous ne revendons ni ne louons vos données à des tiers.
          </p>
        </>
      )
    },
    {
      id: 4,
      icon: FileText,
      title: "4. Base légale du traitement",
      content: (
        <>
          <p className="mb-4">Nous traitons les données sur les bases suivantes :</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>exécution d'un contrat (création et gestion de compte partenaire ou utilisateur) ;</li>
            <li>consentement explicite (cookies, géolocalisation approximative, télémétrie anonymisée) ;</li>
            <li>intérêt légitime (amélioration du service, sécurité et prévention des fraudes).</li>
          </ul>
        </>
      )
    },
    {
      id: 5,
      icon: Database,
      title: "5. Durée de conservation",
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Les comptes utilisateurs sont conservés tant qu'ils restent actifs.</li>
          <li>Les journaux techniques et données d'usage anonymisées sont conservés 12 mois maximum.</li>
          <li>Les données de compte supprimé sont définitivement effacées sous 30 jours.</li>
        </ul>
      )
    },
    {
      id: 6,
      icon: Users,
      title: "6. Partage des données",
      content: (
        <>
          <p className="mb-4">Vos données peuvent être partagées uniquement avec :</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>les partenaires que vous choisissez d'interagir avec (par exemple, lors d'une réservation) ;</li>
            <li>les prestataires techniques nécessaires au fonctionnement du service (hébergement, messagerie, statistiques) ;</li>
            <li>les autorités compétentes, uniquement si la loi l'exige.</li>
          </ul>
          <p className="mt-4">
            Tous nos prestataires respectent les mêmes normes de confidentialité que nous.
          </p>
        </>
      )
    },
    {
      id: 7,
      icon: Eye,
      title: "7. Cookies et outils d'analyse",
      content: (
        <>
          <p className="mb-4">
            Nous utilisons des outils de mesure d'audience respectueux de la vie privée, tels que Matomo ou Plausible Analytics, configurés pour ne pas collecter de données personnelles.
          </p>
          <p className="mb-4">Ces outils nous permettent de connaître :</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>le nombre de visiteurs sur le site,</li>
            <li>les pages les plus consultées,</li>
            <li>le pays d'origine des visiteurs (approximatif).</li>
          </ul>
          <p className="mt-4">
            Vous pouvez refuser l'usage des cookies non essentiels via la bannière de consentement affichée lors de votre première visite.
          </p>
        </>
      )
    },
    {
      id: 8,
      icon: Lock,
      title: "8. Sécurité des données",
      content: (
        <>
          <p className="mb-4">
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>chiffrement des communications (HTTPS, SSL/TLS) ;</li>
            <li>stockage sécurisé et accès limité au personnel autorisé ;</li>
            <li>hachage des mots de passe (bcrypt) ;</li>
            <li>sauvegardes régulières de la base de données.</li>
          </ul>
          <p className="mt-4">
            Cependant, aucun système n'est totalement inviolable : en cas d'incident, vous serez informé conformément à la réglementation en vigueur.
          </p>
        </>
      )
    },
    {
      id: 9,
      icon: Shield,
      title: "9. Vos droits",
      content: (
        <>
          <p className="mb-4">
            Conformément aux principes du RGPD et aux lois locales, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Droit d'accès à vos données personnelles ;</li>
            <li>Droit de rectification en cas d'erreur ;</li>
            <li>Droit à la suppression de vos informations ("droit à l'oubli") ;</li>
            <li>Droit d'opposition à certains traitements (ex. : suivi analytique) ;</li>
            <li>Droit à la portabilité de vos données sur demande.</li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, contactez-nous à l'adresse suivante :<br />
            <a href="mailto:contact@touris.ht" className="text-blue-600 hover:text-blue-800 font-semibold">
              📧 contact@touris.ht
            </a>
          </p>
        </>
      )
    },
    {
      id: 10,
      icon: Globe,
      title: "10. Localisation et transfert des données",
      content: (
        <p>
          Les données sont hébergées sur des serveurs sécurisés, situés dans des centres de données conformes (PlanetScale).
          Aucun transfert non autorisé hors de la juridiction d'Haïti ou de l'espace régional ne sera effectué sans garanties adéquates.
        </p>
      )
    },
    {
      id: 11,
      icon: FileText,
      title: "11. Consentement et modification",
      content: (
        <>
          <p className="mb-4">
            En utilisant notre site ou notre application, vous reconnaissez avoir lu et accepté cette politique de confidentialité.
          </p>
          <p className="mb-4">
            Nous pouvons la mettre à jour périodiquement.
          </p>
          <p>
            En cas de modification importante, vous en serez informé via notification sur le site ou l'application.
          </p>
        </>
      )
    },
    {
      id: 12,
      icon: Mail,
      title: "12. Contact",
      content: (
        <>
          <p className="mb-4">
            Pour toute question, demande ou réclamation relative à la protection de vos données personnelles, vous pouvez nous écrire à :
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">
              📩 <a href="mailto:mdtt@tourisme.gov.ht" className="text-blue-600 hover:text-blue-800">mdtt@tourisme.gov.ht</a>
            </p>
            <p className="text-gray-700">
              ou à l'adresse du Ministère du Tourisme, Port-au-Prince, Haïti.
            </p>
          </div>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Retour à l'accueil</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🇭🇹</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Discover Haiti
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Shield className="w-12 h-12" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Politique de confidentialité
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100"
          >
            Votre vie privée est importante pour nous
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {section.title}
                  </h2>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center text-gray-500 text-sm"
          >
            Dernière mise à jour : Décembre 2025
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4">Discover Haiti</h3>
              <p className="text-gray-400">
                Plateforme de tourisme dédiée à la promotion des merveilles d&apos;Haïti.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin" className="hover:text-white transition">Administration</Link></li>
                <li><Link href="/partner/dashboard" className="hover:text-white transition">Espace Partenaire</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Politique de confidentialité</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:mdtt@tourisme.gov.ht" className="hover:text-white transition">
                    mdtt@tourisme.gov.ht
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Port-au-Prince, Haïti
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Discover Haiti. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
