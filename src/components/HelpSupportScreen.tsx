
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, Book, ExternalLink, ChevronRight, Video } from 'lucide-react-native';

interface HelpSupportScreenProps {
  onBack: () => void;
  onShowQuickStart?: () => void;
}

export default function HelpSupportScreen({ onBack, onShowQuickStart }: HelpSupportScreenProps) {
  const faqs = [
    { question: 'How does the AI detection system work?', category: 'AI & Detection' },
    { question: 'What data sources does Sentinel use?', category: 'Data' },
  ];

  const tutorials = [
    { id: 1, title: 'Getting Started', duration: '8:45' },
    { id: 2, title: 'Understanding the Dashboard', duration: '6:30' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <Tabs defaultValue="tutorials">
        <TabsList>
          <TabsTrigger value="tutorials"><Video size={16} color="#94a3b8" style={{marginRight: 8}}/>Tutorials</TabsTrigger>
          <TabsTrigger value="faqs"><HelpCircle size={16} color="#94a3b8" style={{marginRight: 8}}/>FAQs</TabsTrigger>
          <TabsTrigger value="contact"><MessageCircle size={16} color="#94a3b8" style={{marginRight: 8}}/>Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials">
          <ScrollView style={styles.contentContainer}>
            {onShowQuickStart && (
              <Button onPress={onShowQuickStart} style={styles.quickStartButton}>
                <Text style={styles.quickStartButtonText}>View Quick Start Guide</Text>
              </Button>
            )}
            {tutorials.map(tutorial => (
              <Card key={tutorial.id} style={styles.card}>
                <CardContent style={styles.tutorialCardContent}>
                  <View style={styles.tutorialThumbnail}>
                    <Video size={32} color="white" />
                  </View>
                  <View style={styles.tutorialInfo}>
                    <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
                    <Text style={styles.tutorialDuration}>{tutorial.duration}</Text>
                  </View>
                  <ChevronRight size={16} color="#64748b" />
                </CardContent>
              </Card>
            ))}
          </ScrollView>
        </TabsContent>

        <TabsContent value="faqs">
          <ScrollView style={styles.contentContainer}>
            {faqs.map((faq, index) => (
              <Card key={index} style={styles.card}>
                <CardContent style={styles.faqCardContent}>
                  <View style={{flex: 1}}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Text style={styles.faqCategory}>{faq.category}</Text>
                  </View>
                  <ChevronRight size={16} color="#64748b" />
                </CardContent>
              </Card>
            ))}
          </ScrollView>
        </TabsContent>

        <TabsContent value="contact">
          <ScrollView style={styles.contentContainer}>
            <Button variant="outline" onPress={() => Linking.openURL('mailto:support@sentinel.ai')} style={styles.contactButton}>
              <Mail size={16} color="#94a3b8" style={{marginRight: 8}} />
              <Text style={styles.contactButtonText}>Email Us</Text>
            </Button>
            <Button variant="outline" onPress={() => Linking.openURL('tel:1800-XXX-XXXX')} style={styles.contactButton}>
              <Phone size={16} color="#94a3b8" style={{marginRight: 8}} />
              <Text style={styles.contactButtonText}>Call Support</Text>
            </Button>
          </ScrollView>
        </TabsContent>
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#1a202c',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  quickStartButton: {
    backgroundColor: '#8b5cf6',
    marginBottom: 16,
  },
  quickStartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tutorialCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  tutorialThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tutorialInfo: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  tutorialDuration: {
    fontSize: 12,
    color: '#94a3b8',
  },
  faqCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 14,
    color: 'white',
  },
  faqCategory: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  contactButton: {
    marginBottom: 12,
  },
  contactButtonText: {
    color: '#cbd5e1',
  },
});
