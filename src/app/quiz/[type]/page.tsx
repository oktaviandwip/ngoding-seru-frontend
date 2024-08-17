"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Loading from "@/components/Loading";

interface Question {
  Image: string;
  Question: string;
  Answer: string;
  Level: string;
  Option_a: string;
  Option_b: string;
  Option_c: string;
  Option_d: string;
  Explanation: string;
}

async function getQuestions(type: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/questions/${type}`
    );
    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return { data: [], numbers: [] };
  }
}

type UserAnswer = {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
};

export default function Quiz({ params }: { params: { type: string } }) {
  const [data, setData] = useState<Question[]>([]);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(60);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [timerAdjustment, setTimerAdjustment] = useState<number | null>(null);

  // Set Loading Screen
  const removeLoadingScreen = () => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  };

  // Get Data
  useEffect(() => {
    const fetchData = async () => {
      const quizData = await getQuestions(params.type);
      setData(quizData.data);
      setNumbers(quizData.numbers);
    };

    fetchData();
    removeLoadingScreen();
  }, [params.type]);

  // Start Timer
  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(id);
          setIsLoading(true);
          removeLoadingScreen();
          setQuizFinished(true);
          return 0;
        }
        return prevTime - 0.004;
      });
    }, 1);
    setTimerId(id);
    return () => clearInterval(id);
  }, []);

  // Reordered Questions
  let reorderedQuestions: Question[] = [];
  if (data) {
    reorderedQuestions = numbers.map((number) => data[number - 1]);
  }

  // Handle Next Question
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= reorderedQuestions.length) {
        setIsLoading(true);
        removeLoadingScreen();
        setQuizFinished(true);
        return prevIndex;
      }
      setIsCorrectAnswer(null);
      setSelectedOption("");
      setTimerAdjustment(null);
      return newIndex;
    });
  };

  // Update Timer
  const updateTimer = (seconds: number) => {
    setTimer((prevTime) => Math.min(prevTime + seconds, 60));
  };

  // Handle Answer
  const handleAnswer = (selectedOption: string) => {
    setSelectedOption(selectedOption);
    if (reorderedQuestions.length === 0) return;

    const currentQuestion = reorderedQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.Answer;
    const level = currentQuestion.Level;

    const isCorrect = selectedOption === correctAnswer;
    setIsCorrectAnswer(isCorrect);

    let adjustment = 0;
    if (isCorrect) {
      adjustment = level === "easy" ? 4 : level === "medium" ? 8 : 12;
    } else {
      adjustment = level === "easy" ? -12 : level === "medium" ? -8 : -4;
    }

    setTimerAdjustment(adjustment);
    updateTimer(adjustment);

    // Save User Answers
    setUserAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        question: currentQuestion.Question,
        userAnswer: `(${selectedOption}) ${
          currentQuestion[`Option_${selectedOption}` as keyof Question]
        }`,
        correctAnswer: `(${correctAnswer}) ${
          currentQuestion[`Option_${correctAnswer}` as keyof Question]
        }`,
        explanation: currentQuestion.Explanation,
      },
    ]);

    setTimeout(handleNextQuestion, 500);
  };

  // Capitalize First Letter
  const capitalizeFirstLetter = (word: string) => {
    if (word.length === 0) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  // Calculate Score
  const correctAnswersCount = userAnswers.filter(
    (answer) => answer.userAnswer === answer.correctAnswer
  ).length;

  const incorrectAnswersCount = userAnswers.length - correctAnswersCount;

  // Current Question
  const question = reorderedQuestions[currentQuestionIndex];

  // Render Loading Screen
  if (isLoading) {
    return <Loading />;
  }

  if (quizFinished) {
    return (
      <div className="max-h-[80vh] overflow-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Finished</CardTitle>
            <CardDescription className="font-cofo-medium">
              <span className="text-green-500">
                Correct: {correctAnswersCount}
              </span>
              <span> - </span>
              <span className="text-red-500">
                Incorrect: {incorrectAnswersCount}
              </span>
            </CardDescription>
            <CardDescription></CardDescription>
            <CardDescription className="font-cofo-medium">
              <span className="text-green-500">
                Correct: {correctAnswersCount}
              </span>
              <span> - </span>
              <span className="text-red-500">
                Incorrect: {incorrectAnswersCount}
              </span>
            </CardDescription>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>

        {userAnswers.map((answer, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                Question {answer.questionIndex + 1}: {answer.question}
              </CardTitle>
              <CardDescription
                className={`${
                  answer.userAnswer === answer.correctAnswer
                    ? "text-green-500"
                    : "text-red-500"
                }  font-cofo-medium`}
              >
                Your Answer: {answer.userAnswer}
              </CardDescription>
              <CardDescription
                className={`${
                  answer.userAnswer === answer.correctAnswer ? "hidden" : "flex"
                }`}
              >
                Correct Answer: {answer.correctAnswer}
              </CardDescription>
            </CardHeader>
            <CardContent>{answer.explanation}</CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 mb-10">
      {/* Time Bar */}
      <div className="w-full h-5 border-[2px] rounded-full relative">
        <div
          className={`bg-primary h-4 rounded-full mt-[0.5px]`}
          style={{ width: `${(timer / 60) * 100}%` }}
        />
        {timerAdjustment !== null && (
          <div
            className={`${
              timerAdjustment > 0 ? "text-green-500" : "text-red-500"
            } font-cofo-bold absolute`}
            style={{
              left: `${(timer / 60) * 100}%`,
              transform: "translateX(-50%)",
              top: "120%",
            }}
          >
            {timerAdjustment > 0 ? `+${timerAdjustment}` : timerAdjustment}
          </div>
        )}
      </div>
      <div
        className={`font-cofo-bold ${
          question.Level === "easy" ? "text-green-500" : "text-yellow-500"
        }`}
      >
        {capitalizeFirstLetter(question.Level)}
      </div>
      <div
        className={`${
          question.Image ? "flex" : "hidden"
        } justify-center md:justify-start`}
      >
        <Image
          src={question.Image}
          alt="Image question"
          width={200}
          height={200}
          quality={100}
          className="rounded-sm"
        />
      </div>
      <div>{question.Question}</div>
      <div className="flex flex-col space-y-4">
        {["a", "b", "c", "d"].map((v) => (
          <div
            key={v}
            className={`${
              selectedOption === v
                ? isCorrectAnswer === true
                  ? "bg-green-500 hover:bg-green-500 text-white"
                  : "bg-red-500 hover:bg-red-500 text-white"
                : "bg-secondary text-primary hover:bg-secondary"
            } flex items-center justify-center text-center whitespace-normal break-words rounded-lg p-2 text-sm`}
            onClick={() => handleAnswer(v)}
          >
            <div className="flex">
              {question[`Option_${v}` as keyof Question]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
