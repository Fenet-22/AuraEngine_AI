"use client";

import React, { useState } from 'react';
import { useAuraStore } from '../store/useAuraStore';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import styles from './EventQuiz.module.css';

const steps = [
  {
    title: "Event Foundation",
    questions: [
      { id: 'eventType', label: "What type of event are you planning?", options: ['Wedding', 'Birthday', 'Corporate event', 'Engagement', 'Baby shower', 'Private party', 'Other'] },
      { id: 'guestCount', label: "What’s your guest count?", options: ['Under 20', '20–50', '50–100', '100–200', '200+'], values: [15, 35, 75, 150, 250] },
      { id: 'locationType', label: "Where will the event be held?", options: ['Indoor venue', 'Outdoor venue', 'Mixed indoor/outdoor', 'Not decided yet'] },
      { id: 'budget', label: "What’s your budget range?", options: ['Budget-friendly', 'Moderate', 'Premium', 'Luxury'] },
    ]
  },
  {
    title: "Style & Identity",
    questions: [
      { id: 'style', label: "Which visual style speaks to you most?", options: ['Elegant / Classic', 'Modern / Minimalist', 'Rustic / Boho', 'Glam / Luxury', 'Fun / Playful', 'Cultural / Traditional'] },
      { id: 'colorDirection', label: "Pick a color direction", options: ['Soft neutrals', 'Bold & vibrant', 'Dark & moody', 'Pastels', 'Monochrome', 'Gold & metallic'] },
      { id: 'formality', label: "How formal should the event feel?", options: ['Very casual', 'Semi-casual', 'Formal', 'Black tie'] },
    ]
  },
  {
    title: "Experience",
    questions: [
      { id: 'vibe', label: "What kind of vibe do you want?", options: ['Relaxed & cozy', 'Energetic & lively', 'Romantic & intimate', 'Luxurious & upscale', 'Fun & interactive'] },
      { id: 'lighting', label: "Lighting preference?", options: ['Bright & airy', 'Warm & soft', 'Dramatic lighting', 'Fairy lights', 'Not sure'] },
    ]
  }
];

export default function EventQuiz({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { setEventConfig, eventConfig } = useAuraStore();
  
  const step = steps[currentStep];
  const question = step.questions[currentQuestion];

  const handleSelect = (option: string, index: number) => {
    // Map selection to config
    const update: any = {};
    if (question.id === 'guestCount' && question.values) {
      update.guestCount = question.values[index];
    } else if (question.id === 'style') {
      const styleMap: any = {
        'Modern / Minimalist': 'minimal',
        'Glam / Luxury': 'luxury',
        'Rustic / Boho': 'rustic',
        'Elegant / Classic': 'luxury'
      };
      update.style = styleMap[option] || 'minimal';
    } else {
      update[question.id] = option;
    }
    
    setEventConfig(update);
    
    // Move to next question or step
    if (currentQuestion < step.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentQuestion(0);
    } else {
      onComplete();
    }
  };

  const progress = ((currentStep * 5 + currentQuestion) / 10) * 100;

  return (
    <div className={styles.quizContainer}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className={styles.header}>
        <span className={styles.stepTitle}>{step.title}</span>
        <span className={styles.stepCount}>Step {currentStep + 1} of {steps.length}</span>
      </div>

      <div className={styles.questionSection}>
        <h2 className={styles.questionLabel}>{question.label}</h2>
        
        <div className={styles.optionsGrid}>
          {question.options.map((option, idx) => (
            <button 
              key={option} 
              className={styles.optionBtn}
              onClick={() => handleSelect(option, idx)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.backBtn}
          disabled={currentStep === 0 && currentQuestion === 0}
          onClick={() => {
            if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
            else if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
              setCurrentQuestion(steps[currentStep-1].questions.length - 1);
            }
          }}
        >
          <ChevronLeft size={20} /> Back
        </button>
      </div>
    </div>
  );
}
