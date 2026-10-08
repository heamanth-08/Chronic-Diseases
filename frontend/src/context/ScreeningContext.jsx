import React, { createContext, useContext, useState } from 'react';

const ScreeningContext = createContext(null);

export function ScreeningProvider({ children }) {
  const [stage1Answers, setStage1Answers] = useState({});
  const [stage1Results, setStage1Results] = useState(null);
  const [stage2TargetDisease, setStage2TargetDisease] = useState(null);
  const [stage2Answers, setStage2Answers] = useState({});
  const [finalAssessment, setFinalAssessment] = useState(null);

  const resetScreening = () => {
    setStage1Answers({});
    setStage1Results(null);
    setStage2TargetDisease(null);
    setStage2Answers({});
    setFinalAssessment(null);
  };

  return (
    <ScreeningContext.Provider
      value={{
        stage1Answers,
        setStage1Answers,
        stage1Results,
        setStage1Results,
        stage2TargetDisease,
        setStage2TargetDisease,
        stage2Answers,
        setStage2Answers,
        finalAssessment,
        setFinalAssessment,
        resetScreening
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const context = useContext(ScreeningContext);
  if (!context) {
    throw new Error('useScreening must be used within a ScreeningProvider');
  }
  return context;
}
