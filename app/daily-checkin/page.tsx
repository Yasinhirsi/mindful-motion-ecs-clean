"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

let Sentiment: any;

const NEGATION_WORDS = [
  "not",
  "no",
  "never",
  "don't",
  "doesn't",
  "didn't",
  "isn't",
  "aren't",
  "wasn't",
  "weren't",
  "can't",
  "cannot",
  "couldn't",
  "shouldn't",
  "wouldn't",
  "won't",
];
const INTENSITY_MODIFIERS = {
  very: 1.5,
  really: 1.5,
  extremely: 2.0,
  absolutely: 2.0,
  completely: 1.8,
  totally: 1.8,
  highly: 1.7,
  especially: 1.7,
  particularly: 1.6,
  deeply: 1.8,
  terribly: 1.9,
  incredibly: 1.9,
  super: 1.8,
  truly: 1.7,
  quite: 1.3,
  rather: 1.2,
  so: 1.5,
  somewhat: 0.7,
  slightly: 0.5,
  "a bit": 0.6,
  "a little": 0.6,
  "kind of": 0.7,
  kinda: 0.7,
  "sort of": 0.7,
  barely: 0.4,
  hardly: 0.4,
  almost: 0.8,
  nearly: 0.8,
  partially: 0.7,
  fairly: 0.8,
  just: 0.9,
};

const EMOTIONAL_PHRASES = [
  { phrase: "over the moon", emotions: { joy: 2.0 } },
  { phrase: "on cloud nine", emotions: { joy: 2.0 } },
  { phrase: "down in the dumps", emotions: { sadness: 1.8 } },
  { phrase: "feeling blue", emotions: { sadness: 1.5 } },
  { phrase: "at the end of my rope", emotions: { anxiety: 1.7, anger: 1.2 } },
  { phrase: "losing my mind", emotions: { anxiety: 1.8, fear: 1.2 } },
  { phrase: "freaking out", emotions: { anxiety: 1.7, fear: 1.5 } },
  { phrase: "fed up", emotions: { anger: 1.6, disgust: 1.3 } },
  { phrase: "had it with", emotions: { anger: 1.5, disgust: 1.2 } },
  { phrase: "sick and tired", emotions: { anger: 1.4, disgust: 1.3 } },
  { phrase: "on edge", emotions: { anxiety: 1.6 } },
  { phrase: "stressed out", emotions: { anxiety: 1.7 } },
  { phrase: "heart is racing", emotions: { anxiety: 1.6, fear: 1.3 } },
  {
    phrase: "butterflies in my stomach",
    emotions: { anxiety: 1.2, fear: 0.8, joy: 0.7 },
  },
  { phrase: "hit the roof", emotions: { anger: 1.9 } },
  { phrase: "lost my temper", emotions: { anger: 1.8 } },
  { phrase: "blown away", emotions: { surprise: 1.8 } },
  { phrase: "blown my mind", emotions: { surprise: 1.9 } },
  { phrase: "beside myself", emotions: { surprise: 1.5, anxiety: 1.2 } },
  { phrase: "mixed feelings", emotions: { surprise: 0.9, anxiety: 0.8 } },
  { phrase: "on top of the world", emotions: { joy: 1.9 } },
  { phrase: "in heaven", emotions: { joy: 1.8 } },
  { phrase: "in a good mood", emotions: { joy: 1.4 } },
  { phrase: "in a bad mood", emotions: { anger: 1.2, sadness: 1.1 } },
  { phrase: "couldn't care less", emotions: { disgust: 1.3 } },
  { phrase: "give a damn", emotions: { anger: 1.1 } },
  { phrase: "breaking my heart", emotions: { sadness: 1.9 } },
  { phrase: "heartbroken", emotions: { sadness: 1.9 } },
  { phrase: "falling apart", emotions: { sadness: 1.6, anxiety: 1.3 } },
  { phrase: "cracking up", emotions: { anxiety: 1.4, sadness: 1.1 } },
  { phrase: "out of my mind", emotions: { anxiety: 1.5, fear: 1.2 } },
  { phrase: "scared to death", emotions: { fear: 2.0 } },
  { phrase: "nervous wreck", emotions: { anxiety: 1.9, fear: 1.5 } },
  { phrase: "shaking in my boots", emotions: { fear: 1.8 } },
  { phrase: "creeped out", emotions: { fear: 1.4, disgust: 1.1 } },
  { phrase: "grossed out", emotions: { disgust: 1.7 } },
  { phrase: "makes me sick", emotions: { disgust: 1.6 } },
  { phrase: "can't stand", emotions: { disgust: 1.5, anger: 1.2 } },
  { phrase: "can't believe", emotions: { surprise: 1.5 } },
  { phrase: "mind blown", emotions: { surprise: 1.8 } },
  { phrase: "taken aback", emotions: { surprise: 1.4 } },
  { phrase: "caught off guard", emotions: { surprise: 1.3 } },
  { phrase: "out of nowhere", emotions: { surprise: 1.2 } },
  { phrase: "lonely", emotions: { sadness: 1.4 } },
  { phrase: "all alone", emotions: { sadness: 1.5 } },
  { phrase: "isolated", emotions: { sadness: 1.3, fear: 0.7 } },
  { phrase: "abandoned", emotions: { sadness: 1.6, anger: 0.9 } },
  { phrase: "rejected", emotions: { sadness: 1.5, anger: 0.8 } },
];

// Expanded emotion keyword sets
const EXPANDED_EMOTION_KEYWORDS = {
  joy: [
    "happy",
    "joy",
    "excited",
    "glad",
    "delighted",
    "pleased",
    "cheerful",
    "content",
    "thrilled",
    "wonderful",
    "love",
    "awesome",
    "great",
    "ecstatic",
    "elated",
    "jubilant",
    "overjoyed",
    "radiant",
    "upbeat",
    "blissful",
    "blessed",
    "bright",
    "charmed",
    "cheery",
    "enchanted",
    "enthusiastic",
    "euphoric",
    "fantastic",
    "fortunate",
    "gleeful",
    "gratified",
    "hopeful",
    "jovial",
    "lively",
    "lucky",
    "merry",
    "optimistic",
    "playful",
    "positive",
    "satisfied",
    "sunny",
    "thankful",
    "uplifted",
    "vibrant",
    "victorious",
    "yay",
    "hooray",
    "stoked",
  ],
  sadness: [
    "sad",
    "unhappy",
    "depressed",
    "down",
    "miserable",
    "gloomy",
    "hopeless",
    "grief",
    "sorrow",
    "disappointed",
    "hurt",
    "broken",
    "blue",
    "bummed",
    "crushed",
    "dejected",
    "despairing",
    "devastated",
    "discouraged",
    "disheartened",
    "dispirited",
    "distressed",
    "downcast",
    "grim",
    "heartache",
    "heartbroken",
    "heartsick",
    "melancholy",
    "mournful",
    "pessimistic",
    "regretful",
    "somber",
    "tearful",
    "troubled",
    "upset",
    "weary",
    "woeful",
    "defeated",
    "lonely",
    "isolated",
    "abandoned",
    "lost",
    "empty",
    "numb",
  ],
  anger: [
    "angry",
    "mad",
    "furious",
    "irritated",
    "annoyed",
    "frustrated",
    "outraged",
    "irate",
    "enraged",
    "hostile",
    "hate",
    "dislike",
    "agitated",
    "aggravated",
    "bitter",
    "boiling",
    "cross",
    "displeased",
    "exasperated",
    "fuming",
    "heated",
    "indignant",
    "inflamed",
    "insulted",
    "offended",
    "provoked",
    "resentful",
    "seething",
    "vexed",
    "pissed",
    "worked up",
    "livid",
    "heated",
    "bothered",
    "infuriated",
    "incensed",
    "raging",
  ],
  fear: [
    "afraid",
    "scared",
    "fearful",
    "anxious",
    "worried",
    "nervous",
    "terrified",
    "panic",
    "dread",
    "frightened",
    "apprehensive",
    "alarmed",
    "aghast",
    "cowed",
    "dreading",
    "fearsome",
    "frantic",
    "horrified",
    "intimidated",
    "nervous",
    "overwhelming",
    "panicky",
    "petrified",
    "phobic",
    "shaken",
    "spooked",
    "startled",
    "tense",
    "threatened",
    "timid",
    "trembling",
    "unnerved",
    "wary",
    "jumpy",
    "on edge",
    "freaked out",
    "uneasy",
    "distressed",
    "flustered",
  ],
  surprise: [
    "surprised",
    "shocked",
    "astonished",
    "amazed",
    "startled",
    "unexpected",
    "stunned",
    "wonder",
    "speechless",
    "bewildered",
    "dumbfounded",
    "flabbergasted",
    "floored",
    "incredulous",
    "taken aback",
    "astounded",
    "awestruck",
    "blindsided",
    "dazed",
    "jolted",
    "rattled",
    "staggered",
    "struck",
    "stupefied",
    "thunderstruck",
    "unbelievable",
    "unexpected",
    "wowed",
    "mind blown",
    "blown away",
  ],
  disgust: [
    "disgusted",
    "repulsed",
    "revolted",
    "nauseated",
    "gross",
    "sickened",
    "distaste",
    "aversion",
    "dislike",
    "hate",
    "appalled",
    "detestable",
    "disapproving",
    "disdain",
    "loathing",
    "offended",
    "outraged",
    "repelled",
    "repugnant",
    "revolting",
    "yucky",
    "creepy",
    "foul",
    "hideous",
    "horrid",
    "nasty",
    "offensive",
    "repelling",
    "vile",
    "vulgar",
    "wretched",
    "eww",
    "yuck",
    "ugh",
    "gross out",
  ],
  anxiety: [
    "anxiety",
    "nervous",
    "tense",
    "uneasy",
    "restless",
    "stressed",
    "worried",
    "apprehensive",
    "panic",
    "jittery",
    "agitated",
    "antsy",
    "concerned",
    "disturbed",
    "edgy",
    "fidgety",
    "fretful",
    "irritable",
    "keyed up",
    "on edge",
    "perturbed",
    "rattled",
    "ruffled",
    "shaky",
    "strained",
    "troubled",
    "uncomfortable",
    "uptight",
    "wound up",
    "worried sick",
    "pressured",
    "overwhelmed",
    "distressed",
    "frazzled",
    "anxious",
    "stressed out",
    "freaking out",
  ],
};

export default function DailyCheckinPage() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotions, setEmotions] = useState<Record<string, number> | null>(null);
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  const [emotionSummary, setEmotionSummary] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    const loadSentiment = async () => {
      try {
        Sentiment = (await import("sentiment")).default;
        console.log("Sentiment library loaded successfully");
      } catch (error) {
        console.error("Failed to load Sentiment library:", error);
      }
    };
    loadSentiment();
  }, []);

  const isNegated = (
    text: string,
    wordIndex: number,
    windowSize = 3
  ): boolean => {
    const words = text.split(/\s+/);
    const start = Math.max(0, wordIndex - windowSize);
    const preceding = words.slice(start, wordIndex);

    return preceding.some((word) =>
      NEGATION_WORDS.includes(word.toLowerCase().replace(/[^\w]/g, ""))
    );
  };

  const findModifier = (
    text: string,
    wordIndex: number,
    windowSize = 2
  ): number => {
    const words = text.split(/\s+/);
    const start = Math.max(0, wordIndex - windowSize);
    const preceding = words.slice(start, wordIndex).join(" ").toLowerCase();

    for (const [modifier, intensity] of Object.entries(INTENSITY_MODIFIERS)) {
      if (modifier.includes(" ") && preceding.includes(modifier)) {
        return intensity;
      }
    }

    for (const [modifier, intensity] of Object.entries(INTENSITY_MODIFIERS)) {
      if (
        !modifier.includes(" ") &&
        preceding.split(/\s+/).includes(modifier)
      ) {
        return intensity;
      }
    }

    return 1.0;
  };

  const detectEmotionalPhrases = (text: string): Record<string, number> => {
    const emotionModifiers: Record<string, number> = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0,
      anxiety: 0,
    };

    const lowerText = text.toLowerCase();

    EMOTIONAL_PHRASES.forEach(({ phrase, emotions }) => {
      if (lowerText.includes(phrase)) {
        Object.entries(emotions).forEach(([emotion, intensity]) => {
          if (emotion in emotionModifiers) {
            emotionModifiers[emotion] += 20 * intensity;
          }
        });
      }
    });

    return emotionModifiers;
  };

  const generateEmotionSummary = (
    emotions: Record<string, number>,
    sentimentScore: number
  ): string => {
    const sortedEmotions = Object.entries(emotions)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, value]) => value > 20);

    if (sortedEmotions.length === 0) {
      return sentimentScore > 0.5
        ? "You seem to be in a positive mood."
        : sentimentScore < -0.5
        ? "You seem to be in a negative mood."
        : "Your mood appears to be neutral.";
    }

    const topEmotion = sortedEmotions[0];
    const secondEmotion = sortedEmotions.length > 1 ? sortedEmotions[1] : null;

    let intensityDesc = "";
    if (topEmotion[1] > 75) intensityDesc = "very ";
    else if (topEmotion[1] > 50) intensityDesc = "quite ";
    else if (topEmotion[1] < 30) intensityDesc = "slightly ";

    let summary = `You seem to be feeling ${intensityDesc}${topEmotion[0]}`;

    if (secondEmotion && secondEmotion[1] > 30) {
      summary += ` and ${secondEmotion[1] > 50 ? "quite " : "somewhat "}${
        secondEmotion[0]
      }`;
    }

    if (
      sentimentScore < -1.0 &&
      !summary.includes("sad") &&
      !summary.includes("anger")
    ) {
      summary += ". Your overall tone appears quite negative";
    } else if (sentimentScore > 1.0 && !summary.includes("joy")) {
      summary += ". Your overall tone appears quite positive";
    }

    return summary + ".";
  };

  const detectEmotions = (
    text: string
  ): {
    emotions: Record<string, number>;
    sentimentScore: number;
    summary: string;
  } => {
    const words = text.split(/\s+/);
    const lowerText = text.toLowerCase();

    let sentimentResult = { score: 0, comparative: 0 };
    if (Sentiment) {
      const sentiment = new Sentiment();
      sentimentResult = sentiment.analyze(text);
    }

    const emotionScores: Record<string, number> = {
      joy: 10,
      sadness: 10,
      anger: 10,
      fear: 10,
      surprise: 10,
      disgust: 10,
      anxiety: 10,
    };

    const phraseEmotions = detectEmotionalPhrases(text);
    Object.entries(phraseEmotions).forEach(([emotion, value]) => {
      if (value > 0) {
        emotionScores[emotion] += value;
      }
    });

    Object.entries(EXPANDED_EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        let match: RegExpExecArray | null;

        while ((match = regex.exec(lowerText)) !== null) {
          const wordIndex = words.findIndex((word, index) => {
            const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
            return (
              cleanWord === keyword &&
              lowerText.indexOf(cleanWord, index) === match?.index
            );
          });

          if (wordIndex !== -1) {
            const negated = isNegated(lowerText, wordIndex);

            const modifier = findModifier(lowerText, wordIndex);

            if (negated) {
              if (emotion === "joy") {
                emotionScores.sadness += 10 * modifier;
              } else if (
                ["sadness", "anger", "fear", "disgust", "anxiety"].includes(
                  emotion
                )
              ) {
                emotionScores.joy += 5 * modifier;
              }
            } else {
              emotionScores[emotion] += 15 * modifier;
            }
          }
        }
      });
    });

    const normalizedSentiment = sentimentResult.comparative;

    if (normalizedSentiment > 0) {
      emotionScores.joy += Math.min(normalizedSentiment * 20, 50);
      emotionScores.sadness = Math.max(
        emotionScores.sadness - normalizedSentiment * 10,
        0
      );
      emotionScores.anger = Math.max(
        emotionScores.anger - normalizedSentiment * 10,
        0
      );
    } else if (normalizedSentiment < 0) {
      const negValue = Math.abs(normalizedSentiment);
      emotionScores.sadness += Math.min(negValue * 15, 40);
      emotionScores.anger += Math.min(negValue * 10, 30);
      emotionScores.joy = Math.max(emotionScores.joy - negValue * 15, 0);
    }

    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount > 0) {
      const exclamationMultiplier = Math.min(exclamationCount, 5);
      if (normalizedSentiment > 0) {
        emotionScores.joy += exclamationMultiplier * 5;
        emotionScores.surprise += exclamationMultiplier * 5;
      } else if (normalizedSentiment < 0) {
        emotionScores.anger += exclamationMultiplier * 7;
        emotionScores.surprise += exclamationMultiplier * 3;
      } else {
        emotionScores.surprise += exclamationMultiplier * 8;
      }
    }

    const questionCount = (text.match(/\?/g) || []).length;
    if (questionCount > 0) {
      emotionScores.surprise += Math.min(questionCount * 5, 20);
      emotionScores.anxiety += Math.min(questionCount * 4, 15);
    }

    if (
      /\b(i am|i'm|im|i feel|feeling)\s+(sad|depressed|down|unhappy)\b/i.test(
        text
      )
    ) {
      emotionScores.sadness += 30;
    }

    if (
      /\b(i am|i'm|im|i feel|feeling)\s+(happy|excited|joyful|great)\b/i.test(
        text
      )
    ) {
      emotionScores.joy += 30;
    }

    if (
      /\b(i am|i'm|im|i feel|feeling)\s+(angry|mad|upset|furious)\b/i.test(text)
    ) {
      emotionScores.anger += 30;
    }

    if (
      /\b(i am|i'm|im|i feel|feeling)\s+(scared|afraid|terrified|anxious)\b/i.test(
        text
      )
    ) {
      emotionScores.fear += 30;
      emotionScores.anxiety += 20;
    }

    const strongNegativeEmotions = [
      "sadness",
      "anger",
      "fear",
      "anxiety",
      "disgust",
    ].filter((emotion) => emotionScores[emotion] > 40);

    if (strongNegativeEmotions.length > 1) {
      strongNegativeEmotions.forEach((emotion) => {
        emotionScores[emotion] += 10;
      });
    }

    Object.keys(emotionScores).forEach((emotion) => {
      emotionScores[emotion] = Math.min(emotionScores[emotion], 100);
    });

    const summary = generateEmotionSummary(emotionScores, normalizedSentiment);

    return {
      emotions: emotionScores,
      sentimentScore: sentimentResult.comparative,
      summary,
    };
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!Sentiment) {
      toast({
        title: "Warning",
        description:
          "Sentiment analysis library is still loading. Analysis may be less accurate.",
        variant: "default",
      });
    }

    setIsAnalyzing(true);

    try {
      const {
        emotions: detectedEmotions,
        sentimentScore: score,
        summary,
      } = detectEmotions(text);

      const recommendations: string[] = [];

      if (detectedEmotions.sadness > 70) {
        recommendations.push(
          "Consider reaching out to a therapist to discuss your feelings."
        );
        recommendations.push(
          "Try engaging in activities that bring you joy, like watching a favorite movie or listening to uplifting music."
        );
      }

      if (detectedEmotions.anxiety > 70) {
        recommendations.push(
          "Practice deep breathing exercises to help manage anxiety."
        );
        recommendations.push(
          "Consider trying guided meditation to calm your mind."
        );
      }

      if (detectedEmotions.anger > 70) {
        recommendations.push(
          "Physical activity can help release tension. Consider going for a run or doing some exercise."
        );
        recommendations.push(
          "Practice counting to 10 before reacting when you feel angry."
        );
      }

      if (detectedEmotions.fear > 70) {
        recommendations.push("Talk to someone you trust about your fears.");
        recommendations.push(
          "Try grounding techniques when feeling fearful: focus on 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste."
        );
      }

      if (detectedEmotions.joy > 70) {
        recommendations.push(
          "Share your positive emotions with others to spread joy."
        );
        recommendations.push(
          "Journal about what made you happy to refer back to on harder days."
        );
      }

      if (score < -1.5) {
        recommendations.push(
          "Your message has a strongly negative tone. Consider practicing positive self-talk techniques."
        );
      }

      if (recommendations.length === 0) {
        recommendations.push(
          "Continue monitoring your emotions and practicing self-care."
        );
        recommendations.push(
          "Regular exercise and mindfulness can help maintain emotional balance."
        );
      }

      setEmotions(detectedEmotions);
      setSentimentScore(score);
      setEmotionSummary(summary);
      setRecommendations(recommendations);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await supabase.from("daily_checkins").insert({
          user_id: session.user.id,
          text_content: text,
          emotion_scores: detectedEmotions,
          recommendations: recommendations,
        });

        toast({
          title: "Check-in saved",
          description: "Your daily check-in has been saved successfully.",
        });
      }

      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error analyzing text:", error);
      setIsAnalyzing(false);

      toast({
        title: "Error",
        description: "Failed to analyze text. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getEmotionEmoji = (emotion: string): string => {
    switch (emotion) {
      case "joy":
        return "😊";
      case "sadness":
        return "😢";
      case "anger":
        return "😠";
      case "fear":
        return "😨";
      case "surprise":
        return "😲";
      case "disgust":
        return "🤢";
      case "anxiety":
        return "😰";
      default:
        return "";
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Daily Check-in</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>
              Express your thoughts and feelings to receive personalised
              recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write about how you're feeling today..."
              className="min-h-[200px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={analyzeText}
              disabled={isAnalyzing || !text.trim()}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Emotion Analysis</CardTitle>
            <CardDescription>
              Analysis of your expressed emotions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emotions ? (
              <div className="space-y-4">
                {emotionSummary && (
                  <div className="mb-4 p-3 bg-muted/50 border rounded-lg">
                    <p className="text-sm">{emotionSummary}</p>
                  </div>
                )}

                {sentimentScore !== null && (
                  <div className="mb-4 bg-muted p-3 rounded-lg">
                    <p className="text-sm mb-1 font-medium">
                      Overall Sentiment
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {sentimentScore > 0
                          ? "Positive"
                          : sentimentScore < 0
                          ? "Negative"
                          : "Neutral"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {sentimentScore.toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={50 + sentimentScore * 10}
                      className={`mt-1 ${
                        sentimentScore > 0
                          ? "bg-green-100"
                          : sentimentScore < 0
                          ? "bg-red-100"
                          : ""
                      }`}
                    />
                  </div>
                )}

                {Object.entries(emotions)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emotion, value]) => (
                    <div key={emotion} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize flex items-center">
                          {getEmotionEmoji(emotion)}{" "}
                          <span className="ml-2">{emotion}</span>
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(value)}%
                        </span>
                      </div>
                      <Progress
                        value={value}
                        className={`${
                          value > 50
                            ? emotion === "joy"
                              ? "bg-green-100"
                              : emotion === "sadness"
                              ? "bg-blue-100"
                              : emotion === "anger"
                              ? "bg-red-100"
                              : emotion === "fear" || emotion === "anxiety"
                              ? "bg-purple-100"
                              : emotion === "surprise"
                              ? "bg-yellow-100"
                              : emotion === "disgust"
                              ? "bg-green-200"
                              : ""
                            : ""
                        }`}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Submit your check-in to see emotion analysis
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              Based on your emotional state, here are some recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-5 w-5 text-primary flex-shrink-0"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
