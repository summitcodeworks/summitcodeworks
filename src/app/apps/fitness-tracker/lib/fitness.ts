interface FitnessParams {
  age: number;
  gender: string;
  restingHeartRate: number;
  pushUps: number;
  sitUps: number;
  runTime: number; // in minutes
}

interface FitnessResult {
  level: string;
  score: number;
  hrScore: number;
  strengthScore: number;
  enduranceScore: number;
}

export function calculateFitnessLevel(params: FitnessParams): FitnessResult {
  const { age, gender, restingHeartRate, pushUps, sitUps, runTime } = params;
  
  // Calculate cardiovascular fitness score (0-100)
  // Lower resting heart rate is better
  const hrScore = calculateHeartRateScore(restingHeartRate, age, gender);
  
  // Calculate strength score (0-100)
  const strengthScore = calculateStrengthScore(pushUps, sitUps, age, gender);
  
  // Calculate endurance score (0-100)
  const enduranceScore = calculateEnduranceScore(runTime, age, gender);
  
  // Calculate overall fitness score (weighted average)
  const overallScore = Math.round(
    (hrScore * 0.3) + (strengthScore * 0.3) + (enduranceScore * 0.4)
  );
  
  // Determine fitness level based on overall score
  let fitnessLevel = '';
  if (overallScore >= 90) {
    fitnessLevel = 'Excellent';
  } else if (overallScore >= 80) {
    fitnessLevel = 'Very Good';
  } else if (overallScore >= 70) {
    fitnessLevel = 'Good';
  } else if (overallScore >= 60) {
    fitnessLevel = 'Above Average';
  } else if (overallScore >= 50) {
    fitnessLevel = 'Average';
  } else if (overallScore >= 40) {
    fitnessLevel = 'Below Average';
  } else if (overallScore >= 30) {
    fitnessLevel = 'Poor';
  } else {
    fitnessLevel = 'Very Poor';
  }
  
  return {
    level: fitnessLevel,
    score: overallScore,
    hrScore,
    strengthScore,
    enduranceScore
  };
}

function calculateHeartRateScore(hr: number, age: number, gender: string): number {
  // Lower resting heart rate is better
  // Typical healthy resting HR: 60-100 bpm
  // Athlete resting HR: 40-60 bpm
  
  // Adjust for age (resting HR increases slightly with age)
  // And apply a small gender-based adjustment (women typically have slightly higher resting HR)
  const genderFactor = gender.toLowerCase() === 'female' ? 5 : 0;
  
  // Score calculation (lower HR = higher score)
  // We'll use a base score and adjust it based on age and gender
  let score = 0;
  
  if (hr <= 40) score = 100; // Excellent
  else if (hr <= 50) score = 90;
  else if (hr <= 60) score = 80;
  else if (hr <= 70) score = 70;
  else if (hr <= 75) score = 60;
  else if (hr <= 80) score = 50;
  else if (hr <= 85) score = 40;
  else if (hr <= 90) score = 30;
  else if (hr <= 100) score = 20;
  else score = 10; // Poor
  
  // Apply a small bonus for older individuals and females since their resting HR tends to be higher
  const ageBonus = Math.min(10, Math.floor(age / 10));
  
  return Math.min(100, score + ageBonus + genderFactor);
}

function calculateStrengthScore(pushUps: number, sitUps: number, age: number, gender: string): number {
  // Calculate push-up score
  const pushUpScore = calculatePushUpScore(pushUps, age, gender);
  
  // Calculate sit-up score
  const sitUpScore = calculateSitUpScore(sitUps, age, gender);
  
  // Average the two scores
  return Math.round((pushUpScore + sitUpScore) / 2);
}

function calculatePushUpScore(pushUps: number, age: number, gender: string): number {
  // Different standards based on gender
  if (gender.toLowerCase() === 'female') {
    // Female push-up standards (adjusted by age)
    if (age < 30) {
      if (pushUps >= 35) return 100;
      if (pushUps >= 30) return 90;
      if (pushUps >= 25) return 80;
      if (pushUps >= 20) return 70;
      if (pushUps >= 15) return 60;
      if (pushUps >= 10) return 50;
      if (pushUps >= 5) return 30;
      return 10;
    } else if (age < 40) {
      if (pushUps >= 30) return 100;
      if (pushUps >= 25) return 90;
      if (pushUps >= 20) return 80;
      if (pushUps >= 15) return 70;
      if (pushUps >= 10) return 60;
      if (pushUps >= 5) return 40;
      return 20;
    } else {
      if (pushUps >= 25) return 100;
      if (pushUps >= 20) return 90;
      if (pushUps >= 15) return 80;
      if (pushUps >= 10) return 70;
      if (pushUps >= 5) return 50;
      return 30;
    }
  } else {
    // Male push-up standards (adjusted by age)
    if (age < 30) {
      if (pushUps >= 50) return 100;
      if (pushUps >= 40) return 90;
      if (pushUps >= 30) return 80;
      if (pushUps >= 25) return 70;
      if (pushUps >= 20) return 60;
      if (pushUps >= 15) return 50;
      if (pushUps >= 10) return 30;
      return 10;
    } else if (age < 40) {
      if (pushUps >= 40) return 100;
      if (pushUps >= 30) return 90;
      if (pushUps >= 25) return 80;
      if (pushUps >= 20) return 70;
      if (pushUps >= 15) return 60;
      if (pushUps >= 10) return 40;
      return 20;
    } else {
      if (pushUps >= 30) return 100;
      if (pushUps >= 25) return 90;
      if (pushUps >= 20) return 80;
      if (pushUps >= 15) return 70;
      if (pushUps >= 10) return 50;
      return 30;
    }
  }
}

function calculateSitUpScore(sitUps: number, age: number, gender: string): number {
  // Different standards based on gender
  if (gender.toLowerCase() === 'female') {
    // Female sit-up standards (in 1 minute, adjusted by age)
    if (age < 30) {
      if (sitUps >= 45) return 100;
      if (sitUps >= 40) return 90;
      if (sitUps >= 35) return 80;
      if (sitUps >= 30) return 70;
      if (sitUps >= 25) return 60;
      if (sitUps >= 20) return 50;
      if (sitUps >= 15) return 30;
      return 10;
    } else if (age < 40) {
      if (sitUps >= 40) return 100;
      if (sitUps >= 35) return 90;
      if (sitUps >= 30) return 80;
      if (sitUps >= 25) return 70;
      if (sitUps >= 20) return 60;
      if (sitUps >= 15) return 40;
      return 20;
    } else {
      if (sitUps >= 35) return 100;
      if (sitUps >= 30) return 90;
      if (sitUps >= 25) return 80;
      if (sitUps >= 20) return 70;
      if (sitUps >= 15) return 50;
      return 30;
    }
  } else {
    // Male sit-up standards (in 1 minute, adjusted by age)
    if (age < 30) {
      if (sitUps >= 55) return 100;
      if (sitUps >= 50) return 90;
      if (sitUps >= 45) return 80;
      if (sitUps >= 40) return 70;
      if (sitUps >= 35) return 60;
      if (sitUps >= 30) return 50;
      if (sitUps >= 25) return 30;
      return 10;
    } else if (age < 40) {
      if (sitUps >= 50) return 100;
      if (sitUps >= 45) return 90;
      if (sitUps >= 40) return 80;
      if (sitUps >= 35) return 70;
      if (sitUps >= 30) return 60;
      if (sitUps >= 25) return 40;
      return 20;
    } else {
      if (sitUps >= 45) return 100;
      if (sitUps >= 40) return 90;
      if (sitUps >= 35) return 80;
      if (sitUps >= 30) return 70;
      if (sitUps >= 25) return 50;
      return 30;
    }
  }
}

function calculateEnduranceScore(runTime: number, age: number, gender: string): number {
  // Different standards based on gender
  // runTime is in minutes for 1 mile
  if (gender.toLowerCase() === 'female') {
    // Female 1-mile run standards (adjusted by age)
    if (age < 30) {
      if (runTime <= 6.5) return 100;
      if (runTime <= 7.0) return 90;
      if (runTime <= 7.5) return 80;
      if (runTime <= 8.0) return 70;
      if (runTime <= 9.0) return 60;
      if (runTime <= 10.0) return 50;
      if (runTime <= 11.0) return 40;
      if (runTime <= 12.0) return 30;
      return 20;
    } else if (age < 40) {
      if (runTime <= 7.0) return 100;
      if (runTime <= 7.5) return 90;
      if (runTime <= 8.0) return 80;
      if (runTime <= 8.5) return 70;
      if (runTime <= 9.5) return 60;
      if (runTime <= 10.5) return 50;
      if (runTime <= 11.5) return 40;
      if (runTime <= 12.5) return 30;
      return 20;
    } else {
      if (runTime <= 7.5) return 100;
      if (runTime <= 8.0) return 90;
      if (runTime <= 8.5) return 80;
      if (runTime <= 9.0) return 70;
      if (runTime <= 10.0) return 60;
      if (runTime <= 11.0) return 50;
      if (runTime <= 12.0) return 40;
      if (runTime <= 13.0) return 30;
      return 20;
    }
  } else {
    // Male 1-mile run standards (adjusted by age)
    if (age < 30) {
      if (runTime <= 5.5) return 100;
      if (runTime <= 6.0) return 90;
      if (runTime <= 6.5) return 80;
      if (runTime <= 7.0) return 70;
      if (runTime <= 8.0) return 60;
      if (runTime <= 9.0) return 50;
      if (runTime <= 10.0) return 40;
      if (runTime <= 11.0) return 30;
      return 20;
    } else if (age < 40) {
      if (runTime <= 6.0) return 100;
      if (runTime <= 6.5) return 90;
      if (runTime <= 7.0) return 80;
      if (runTime <= 7.5) return 70;
      if (runTime <= 8.5) return 60;
      if (runTime <= 9.5) return 50;
      if (runTime <= 10.5) return 40;
      if (runTime <= 11.5) return 30;
      return 20;
    } else {
      if (runTime <= 6.5) return 100;
      if (runTime <= 7.0) return 90;
      if (runTime <= 7.5) return 80;
      if (runTime <= 8.0) return 70;
      if (runTime <= 9.0) return 60;
      if (runTime <= 10.0) return 50;
      if (runTime <= 11.0) return 40;
      if (runTime <= 12.0) return 30;
      return 20;
    }
  }
} 