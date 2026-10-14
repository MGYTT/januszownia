"use client";

import Link from "next/link";

import {
  useRef,
  useState,
} from "react";

import {
  Icon,
} from "@/components/ui/icon";

import {
  calculateJanuszometer,
  januszometerQuestions,
  type JanuszometerResult,
} from "@/lib/entertainment/januszometr";

export function Januszometer() {
  const quizRef =
    useRef<HTMLDivElement>(
      null,
    );

  const [
    answers,
    setAnswers,
  ] =
    useState<Record<string, number>>(
      {},
    );

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(
      0,
    );

  const [
    result,
    setResult,
  ] =
    useState<JanuszometerResult | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const totalQuestions =
    januszometerQuestions.length;

  const currentQuestion =
    januszometerQuestions[
      currentIndex
    ];

  const selectedAnswer =
    answers[
      currentQuestion.id
    ];

  const answeredCount =
    Object.keys(
      answers,
    ).length;

  const progress =
    (
      answeredCount /
      totalQuestions
    ) *
    100;

  const isLastQuestion =
    currentIndex ===
    totalQuestions -
      1;

  function chooseAnswer(
    points:
      number,
  ) {
    setAnswers(
      (
        current,
      ) => ({
        ...current,
        [currentQuestion.id]:
          points,
      }),
    );

    setError(
      null,
    );
  }

  function goNext() {
    if (
      selectedAnswer ===
      undefined
    ) {
      setError(
        "Wybierz odpowiedź, zanim ruszysz dalej.",
      );

      return;
    }

    if (
      isLastQuestion
    ) {
      calculate();
      return;
    }

    setCurrentIndex(
      (
        current,
      ) =>
        current +
        1,
    );

    setError(
      null,
    );

    scrollToQuiz();
  }

  function goBack() {
    if (
      currentIndex ===
      0
    ) {
      return;
    }

    setCurrentIndex(
      (
        current,
      ) =>
        current -
        1,
    );

    setError(
      null,
    );

    scrollToQuiz();
  }

  function calculate() {
    try {
      const orderedAnswers =
        januszometerQuestions.map(
          (
            question,
          ) => {
            const answer =
              answers[
                question.id
              ];

            if (
              answer ===
              undefined
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

      setResult(
        nextResult,
      );

      setError(
        null,
      );

      scrollToQuiz();
    } catch (
      unknownError
    ) {
      setError(
        unknownError instanceof
          Error
          ? unknownError.message
          : "Nie udało się policzyć wyniku.",
      );
    }
  }

  function reset() {
    setAnswers(
      {},
    );

    setCurrentIndex(
      0,
    );

    setResult(
      null,
    );

    setError(
      null,
    );

    scrollToQuiz();
  }

  function scrollToQuiz() {
    window.requestAnimationFrame(
      () => {
        quizRef.current
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });
      },
    );
  }

  return (
    <div
      ref={
        quizRef
      }
      className="scroll-mt-24"
    >
      {result ? (
        <ResultView
          result={
            result
          }
          onReset={
            reset
          }
        />
      ) : (
        <section className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
          <div className="bg-brand-900 p-5 text-white sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-brand-200">
                  Januszometr
                </p>

                <p className="mt-1 text-sm font-bold text-brand-100">
                  Pytanie{" "}
                  {currentIndex +
                    1}{" "}
                  z{" "}
                  {totalQuestions}
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black">
                {answeredCount}/
                {totalQuestions}{" "}
                odpowiedzi
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent-400 transition-[width] duration-300"
                style={{
                  width:
                    `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-brand-700">
                Sytuacja{" "}
                {currentIndex +
                  1}
              </span>

              <span className="text-xs font-semibold text-muted">
                Wybierz to, co najbardziej
                do Ciebie pasuje
              </span>
            </div>

            <fieldset className="mt-5">
              <legend className="max-w-3xl text-2xl font-black leading-tight tracking-[-0.03em] text-ink sm:text-3xl">
                {
                  currentQuestion.question
                }
              </legend>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {currentQuestion.answers.map(
                  (
                    answer,
                    answerIndex,
                  ) => {
                    const id =
                      currentQuestion.id +
                      "-" +
                      answerIndex;

                    const selected =
                      selectedAnswer ===
                      answer.points;

                    return (
                      <label
                        key={
                          id
                        }
                        htmlFor={
                          id
                        }
                        className={[
                          "group relative flex min-h-24 cursor-pointer items-start gap-4 rounded-[1.35rem] border p-4 transition sm:p-5",
                          selected
                            ? "border-brand-300 bg-brand-50 shadow-sm"
                            : "border-line bg-canvas hover:border-brand-200 hover:bg-brand-50/40",
                        ].join(
                          " ",
                        )}
                      >
                        <input
                          id={
                            id
                          }
                          type="radio"
                          name={
                            currentQuestion.id
                          }
                          value={
                            answer.points
                          }
                          checked={
                            selected
                          }
                          onChange={
                            () =>
                              chooseAnswer(
                                answer.points,
                              )
                          }
                          className="sr-only"
                        />

                        <span
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition",
                            selected
                              ? "border-brand-300 bg-brand-600 text-white"
                              : "border-line bg-white text-muted group-hover:text-brand-700",
                          ].join(
                            " ",
                          )}
                        >
                          {
                            answerLetter(
                              answerIndex,
                            )
                          }
                        </span>

                        <span className="min-w-0 flex-1 pt-1.5 text-sm font-bold leading-6 text-ink">
                          {
                            answer.label
                          }
                        </span>

                        {selected ? (
                          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                            <Icon
                              name="check"
                              className="h-3.5 w-3.5"
                            />
                          </span>
                        ) : null}
                      </label>
                    );
                  },
                )}
              </div>
            </fieldset>

            {error ? (
              <div
                role="alert"
                className="mt-5 rounded-2xl border border-danger-600/20 bg-danger-50 p-4 text-sm font-bold text-danger-600"
              >
                {error}
              </div>
            ) : null}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={
                  goBack
                }
                disabled={
                  currentIndex ===
                  0
                }
                className="min-h-11 rounded-button border border-line bg-white px-4 py-2.5 text-sm font-black text-muted transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Poprzednie pytanie
              </button>

              <button
                type="button"
                onClick={
                  goNext
                }
                disabled={
                  selectedAnswer ===
                  undefined
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLastQuestion
                  ? "Pokaż cebulowy werdykt"
                  : "Następne pytanie"}

                <Icon
                  name={
                    isLastQuestion
                      ? "trophy"
                      : "arrow-right"
                  }
                  className="h-4 w-4"
                />
              </button>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-muted">
              Odpowiedzi są używane tylko
              do policzenia tego testu.
              Wynik nie trafia do profilu,
              rankingu ani Cebulionów.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function ResultView({
  result,
  onReset,
}: {
  result:
    JanuszometerResult;

  onReset:
    () => void;
}) {
  return (
    <section
      aria-live="polite"
      className="overflow-hidden rounded-[2rem] border border-brand-200 bg-white shadow-card"
    >
      <div className="bg-brand-900 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700">
              <Icon
                name="trophy"
                className="h-7 w-7"
              />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-brand-200">
              Cebulowy werdykt
            </p>

            <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              {result.title}
            </h2>
          </div>

          <div className="shrink-0 rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.1em] text-brand-200">
              Wynik
            </p>

            <div className="mt-1 flex items-end gap-1.5">
              <span className="text-4xl font-black tracking-[-0.05em]">
                {
                  result.percentage
                }
                %
              </span>

              <span className="pb-1 text-xs font-bold text-brand-100">
                cebuli
              </span>
            </div>
          </div>
        </div>

        <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent-400"
            style={{
              width:
                `${result.percentage}%`,
            }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <p className="max-w-3xl text-base font-semibold leading-7 text-ink">
          {
            result.description
          }
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ResultFact
            label="Punkty"
            value={
              result.score +
              " / " +
              result.maxScore
            }
            detail="Suma odpowiedzi z ośmiu sytuacji."
          />

          <ResultFact
            label="Znaczenie"
            value="Tylko rozrywka"
            detail="To nie jest ocena finansowa ani test kompetencji."
          />
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-canvas p-4">
          <p className="text-sm font-black text-ink">
            Ważne
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            Januszometr jest celowo
            humorystyczny. W prawdziwych
            decyzjach zakupowych korzystaj
            z danych, własnych cen i
            kalkulatorów Januszowni.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={
              onReset
            }
            className="min-h-11 rounded-button bg-brand-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-brand-700"
          >
            Zrób test jeszcze raz
          </button>

          <Link
            href="/narzedzia"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-line bg-white px-5 py-2.5 text-sm font-black text-ink transition hover:bg-canvas"
          >
            Przejdź do prawdziwych obliczeń

            <Icon
              name="calculator"
              className="h-4 w-4 text-brand-700"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ResultFact({
  label,
  value,
  detail,
}: {
  label:
    string;

  value:
    string;

  detail:
    string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-muted">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-brand-800">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-muted">
        {detail}
      </p>
    </div>
  );
}

function answerLetter(
  index:
    number,
): string {
  return String.fromCharCode(
    65 +
    index,
  );
}
