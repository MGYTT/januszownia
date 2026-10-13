"use client";

import { useState } from "react";

import { Icon } from "@/components/ui/icon";
import {
  calculateJanuszometer,
  januszometerQuestions,
  type JanuszometerResult,
} from "@/lib/entertainment/januszometr";

export function Januszometer() {
  const [answers, setAnswers] =
    useState<Record<string, number>>(
      {},
    );

  const [result, setResult] =
    useState<JanuszometerResult | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(null);

  const answeredCount =
    Object.keys(answers).length;

  const progress =
    (answeredCount /
      januszometerQuestions.length) *
    100;

  function setAnswer(
    questionId: string,
    points: number,
  ) {
    setAnswers((current) => ({
      ...current,
      [questionId]: points,
    }));

    setResult(null);
    setError(null);
  }

  function calculate() {
    try {
      const orderedAnswers =
        januszometerQuestions.map(
          (question) => {
            const answer =
              answers[
                question.id
              ];

            if (
              answer === undefined
            ) {
              throw new Error(
                "Odpowiedz na wszystkie pytania.",
              );
            }

            return answer;
          },
        );

      const nextResult =
        calculateJanuszometer(
          orderedAnswers,
        );

      setResult(nextResult);
      setError(null);
    } catch (unknownError) {
      if (
        unknownError instanceof Error
      ) {
        setError(
          unknownError.message,
        );
      } else {
        setError(
          "Nie udało się policzyć wyniku.",
        );
      }
    }
  }

  function reset() {
    setAnswers({});
    setResult(null);
    setError(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <div className="sticky top-16 z-20 border-b border-line bg-canvas/95 py-3 backdrop-blur lg:top-[72px]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold">
            {answeredCount}/
            {
              januszometerQuestions.length
            }{" "}
            odpowiedzi
          </span>

          <span className="text-sm font-black text-brand-700">
            {Math.round(
              progress,
            )}
            %
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {januszometerQuestions.map(
          (
            question,
            questionIndex,
          ) => (
            <fieldset
              key={question.id}
              className="rounded-[2rem] border border-line bg-white p-5 shadow-sm sm:p-6"
            >
              <legend className="px-2 text-sm font-black text-brand-700">
                Pytanie{" "}
                {questionIndex + 1}
              </legend>

              <h2 className="mt-1 text-lg font-black sm:text-xl">
                {
                  question.question
                }
              </h2>

              <div className="mt-5 grid gap-2">
                {question.answers.map(
                  (
                    answer,
                    answerIndex,
                  ) => {
                    const id = `${question.id}-${answerIndex}`;

                    const selected =
                      answers[
                        question.id
                      ] ===
                      answer.points;

                    return (
                      <label
                        key={id}
                        htmlFor={id}
                        className={
                          selected
                            ? "flex cursor-pointer items-start gap-3 rounded-2xl border border-brand-300 bg-brand-50 p-4"
                            : "flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-canvas p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
                        }
                      >
                        <input
                          id={id}
                          type="radio"
                          name={
                            question.id
                          }
                          value={
                            answer.points
                          }
                          checked={
                            selected
                          }
                          onChange={() =>
                            setAnswer(
                              question.id,
                              answer.points,
                            )
                          }
                          className="mt-1 h-4 w-4 accent-[var(--color-brand-600)]"
                        />

                        <span className="text-sm font-semibold leading-6">
                          {
                            answer.label
                          }
                        </span>
                      </label>
                    );
                  },
                )}
              </div>
            </fieldset>
          ),
        )}
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-bold text-danger-600"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-7">
        <button
          type="button"
          onClick={calculate}
          className="min-h-12 w-full rounded-button bg-brand-600 px-6 py-3 font-black text-white transition hover:bg-brand-700"
        >
          Policz mój poziom cebuli
        </button>
      </div>

      {result ? (
        <section
          aria-live="polite"
          className="mt-8 overflow-hidden rounded-[2rem] border border-brand-200 bg-white shadow-card"
        >
          <div className="bg-brand-900 p-6 text-white sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700">
              <Icon
                name="trophy"
                className="h-7 w-7"
              />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-brand-200">
              Twój wynik
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {result.title}
            </h2>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-black">
                {
                  result.percentage
                }
                %
              </span>

              <span className="pb-1 text-sm text-brand-200">
                cebuli
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="leading-7 text-muted">
              {
                result.description
              }
            </p>

            <p className="mt-4 text-sm text-muted">
              Punkty:{" "}
              <strong className="text-ink">
                {result.score}/
                {
                  result.maxScore
                }
              </strong>
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-6 min-h-11 rounded-button border border-line px-4 py-2.5 text-sm font-bold transition hover:bg-canvas"
            >
              Zrób test ponownie
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}