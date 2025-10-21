import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { ArrowLeft, Video, Play, Download, FileText, HelpCircle, Mail, ChevronRight, Sparkles } from 'lucide-react-native';

interface HelpSupportScreenProps {
  onBack: () => void;
  onShowQuickStart?: () => void;
}

export default function HelpSupportScreen({ onBack, onShowQuickStart }: HelpSupportScreenProps) {
  const [activeTab, setActiveTab] = useState<'tutorials' | 'faqs' | 'contact'>('tutorials');

  const tutorials = [
    { id: 1, title: 'Getting Started with Sentinel AI', duration: '8:45', color: '#8b5cf6' },
    { id: 2, title: 'Understanding the Dashboard', duration: '6:30', color: '#10b981' },
    { id: 3, title: 'Alert System Deep Dive', duration: '10:15', color: '#ef4444' },
  ];

  const faqs = [
    { question: 'How does the AI detection system work?', category: 'AI & Detection' },
    { question: 'What data sources does Sentinel use?', category: 'Data' },
    { question: 'How accurate are the predictions?', category: 'AI & Detection' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <View style={styles.subtitle}>
        <Text style={styles.subtitleText}>Tutorials, FAQs & Support</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabsList}>
        <TouchableOpacity style={[styles.tab, activeTab === 'tutorials' && styles.activeTab]} onPress={() => setActiveTab('tutorials')}>
          <Video size={16} color={activeTab === 'tutorials' ? 'white' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'tutorials' && styles.activeTabText]}>Tutorials</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'faqs' && styles.activeTab]} onPress={() => setActiveTab('faqs')}>
          <HelpCircle size={16} color={activeTab === 'faqs' ? 'white' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'faqs' && styles.activeTabText]}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'contact' && styles.activeTab]} onPress={() => setActiveTab('contact')}>
          <Mail size={16} color={activeTab === 'contact' ? 'white' : '#94a3b8'} />
          <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Tutorials Tab */}
      {activeTab === 'tutorials' && (
        <ScrollView style={styles.contentContainer}>
          {onShowQuickStart && (
            <TouchableOpacity style={styles.quickStartButton} onPress={onShowQuickStart}>
              <Sparkles size={20} color="white" />
              <Text style={styles.quickStartButtonText}>View Quick Start Guide</Text>
            </TouchableOpacity>
          )}

          {/* Featured Tutorial */}
          <View style={styles.featuredSection}>
            <View style={styles.featuredBadge}>
              <Sparkles size={14} color="#fbbf24" />
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
            
            <View style={[styles.videoThumbnail, { backgroundColor: '#3b82f6' }]}>
              <View style={styles.playButtonLarge}>
                <Play size={40} color="white" fill="white" />
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>8:45</Text>
              </View>
            </View>

            <View style={styles.featuredInfo}>
              <View style={styles.featuredHeader}>
                <Video size={20} color="#3b82f6" />
                <View style={styles.featuredTitleContainer}>
                  <Text style={styles.featuredTitle}>Getting Started with Sentinel AI</Text>
                  <Text style={styles.featuredDescription}>Complete step-by-step guide to installing dependencies, setting up the environment, and running the Sentinel AI dashboard application on your local machine.</Text>
                </View>
              </View>

              <View style={styles.featuredActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Play size={16} color="white" />
                  <Text style={styles.actionButtonText}>Watch Tutorial</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
                  <Download size={16} color="#94a3b8" />
                  <Text style={styles.actionButtonTextSecondary}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
                  <FileText size={16} color="#94a3b8" />
                  <Text style={styles.actionButtonTextSecondary}>Transcript</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* All Tutorials List */}
          <View style={styles.tutorialsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderIcon}></Text>
              <Text style={styles.sectionTitle}>All Tutorials</Text>
            </View>

            {tutorials.map((tutorial) => (
              <TouchableOpacity key={tutorial.id} style={styles.tutorialCard}>
                <View style={[styles.tutorialThumbnail, { backgroundColor: tutorial.color }]}>
                  <Play size={24} color="white" fill="white" />
                  <View style={styles.tutorialDurationBadge}>
                    <Text style={styles.tutorialDurationText}>{tutorial.duration}</Text>
                  </View>
                </View>
                <View style={styles.tutorialInfo}>
                  <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <ScrollView style={styles.contentContainer}>
          {faqs.map((faq, index) => (
            <TouchableOpacity key={index} style={styles.faqCard}>
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqCategory}>{faq.category}</Text>
              </View>
              <ChevronRight size={20} color="#64748b" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <ScrollView style={styles.contentContainer}>
          <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('mailto:support@sentinel.ai')}>
            <View style={styles.contactIcon}>
              <Mail size={24} color="#3b82f6" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDetail}>support@sentinel.ai</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, paddingTop: Platform.OS === 'ios' ? 50 : 20, backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  backButton: { padding: 8, marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  subtitle: { backgroundColor: '#1e293b', paddingHorizontal: 24, paddingBottom: 16 },
  subtitleText: { fontSize: 14, color: '#94a3b8' },
  tabsList: { flexDirection: 'row', backgroundColor: '#1e293b', paddingHorizontal: 16, paddingBottom: 4, gap: 8 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, gap: 6 },
  activeTab: { backgroundColor: '#3b82f6' },
  tabText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  activeTabText: { color: 'white', fontWeight: '600' },
  contentContainer: { flex: 1, padding: 16 },
  quickStartButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#a855f7', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, marginBottom: 16, gap: 8 },
  quickStartButtonText: { color: 'white', fontSize: 15, fontWeight: '600' },
  featuredSection: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 24 },
  featuredBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#422006', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12, gap: 4 },
  featuredBadgeText: { color: '#fbbf24', fontSize: 11, fontWeight: '600' },
  videoThumbnail: { width: '100%', height: 180, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' },
  playButtonLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255, 255, 255, 0.3)' },
  durationBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  durationText: { color: 'white', fontSize: 12, fontWeight: '600' },
  featuredInfo: { gap: 16 },
  featuredHeader: { flexDirection: 'row', gap: 12 },
  featuredTitleContainer: { flex: 1 },
  featuredTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 6 },
  featuredDescription: { fontSize: 13, color: '#94a3b8', lineHeight: 18 },
  featuredActions: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, gap: 6 },
  actionButtonSecondary: { backgroundColor: '#334155' },
  actionButtonText: { color: 'white', fontSize: 12, fontWeight: '600' },
  actionButtonTextSecondary: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  tutorialsSection: { gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  sectionHeaderIcon: { fontSize: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  tutorialCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginBottom: 8, gap: 12 },
  tutorialThumbnail: { width: 80, height: 60, borderRadius: 8, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tutorialDurationBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tutorialDurationText: { color: 'white', fontSize: 10, fontWeight: '600' },
  tutorialInfo: { flex: 1 },
  tutorialTitle: { fontSize: 14, fontWeight: '600', color: 'white' },
  faqCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 8, gap: 12 },
  faqContent: { flex: 1 },
  faqQuestion: { fontSize: 14, fontWeight: '500', color: 'white', marginBottom: 4 },
  faqCategory: { fontSize: 12, color: '#64748b' },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 8, gap: 12 },
  contactIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1e3a8a', alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 14, fontWeight: '600', color: 'white', marginBottom: 2 },
  contactDetail: { fontSize: 12, color: '#94a3b8' },
});
