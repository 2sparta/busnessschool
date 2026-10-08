"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import type { CourseId } from "@/lib/school";

const lessonTitles: Record<CourseId, readonly string[]> = {
  "under-16": [
    "Що таке гроші і як вони працюють",
    "Гривня: чому вона важлива для тебе",
    "Інші валюти світу та найстабільніші з них",
    "Куди можна вкладатися: базові варіанти",
    "Можливості інвестування у 14–16 років",
    "Що робити з грошима",
    "Картки і рахунки: як вони працюють",
  ],
  "age-16-30": [
    "База: основи фінансової грамотності",
    "Кредити: як використовувати їх на свою користь",
    "Іпотека: як вона працює",
    "Перші гроші: найпопулярніші способи заробітку",
    "Що робити з грошима: версія Pro",
    "Бізнес: ФОП, податки та військові збори",
    "Інвестиції: з чого почати",
    "Крипта: як на ній заробляти, блокчейн і фармінг",
    "Блог: як заробляти, реклама й розвиток бренду",
  ],
  "age-30-60": [
    "База: мінімальні основи фінансів",
    "Інвестиції: як вони працюють",
    "Крипта і інвестиції: порівняння",
    "Пенсійні фонди: що таке пенсія",
    "Державна пенсія і як забезпечити собі пенсію",
    "Блог: як на ньому заробляти",
    "Фінансова незалежність: ознаки",
    "Фінансова незалежність: як її досягти",
  ],
};

type LearningProgressProps = {
  purchaseId: string;
  courseId: CourseId;
};

export function LearningProgress({ purchaseId, courseId }: LearningProgressProps) {
  const titles = lessonTitles[courseId];
  const storageKey = `empire-progress-${purchaseId}`;
  const lessonIds = useMemo(() => titles.map((_, index) => `lesson-${index + 1}`), [titles]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompleted(parsed.filter((id): id is string => typeof id === "string" && lessonIds.includes(id)));
        }
      }
    } catch {
      setCompleted([]);
    }
    setHasLoaded(true);
  }, [lessonIds, storageKey]);

  useEffect(() => {
    if (!hasLoaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(completed));
    } catch {
      // Progress stays usable for the current session if browser storage is unavailable.
    }
  }, [completed, hasLoaded, storageKey]);

  const percentage = Math.round((completed.length / titles.length) * 100);

  const toggleLesson = (lessonId: string) => {
    setCompleted((current) =>
      current.includes(lessonId) ? current.filter((item) => item !== lessonId) : [...current, lessonId],
    );
  };

  return (
    <section className="progress-card" aria-labelledby="progress-title">
      <div className="progress-card-heading">
        <div>
          <p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Твій навчальний маршрут</p>
          <h2 id="progress-title">Почни з першого кроку</h2>
        </div>
        <span className="progress-count">{completed.length} / {titles.length} <small>завершено</small></span>
      </div>
      <div className="progress-track" aria-label={`Прогрес ${percentage}%`}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <div className="lesson-list">
        {titles.map((title, index) => {
          const lessonId = lessonIds[index];
          const isComplete = completed.includes(lessonId);
          return (
            <button
              className={`lesson-row${isComplete ? " is-complete" : ""}`}
              type="button"
              key={lessonId}
              aria-pressed={isComplete}
              onClick={() => toggleLesson(lessonId)}
            >
              <span className="lesson-step">{isComplete ? <Icon name="check" size={16} /> : `0${index + 1}`}</span>
              <span className="lesson-title">{title}<small>Практичний модуль · {18 + index * 3} хв</small></span>
              <span className="lesson-status">{isComplete ? "Пройдено" : "Позначити"}</span>
            </button>
          );
        })}
      </div>
      <p className="progress-caption" aria-live="polite">
        {percentage === 100 ? "Чудова робота — маршрут завершено. Обери наступну ціль!" : "Натискай на модуль після перегляду, щоб зберегти свій прогрес."}
      </p>
    </section>
  );
}
