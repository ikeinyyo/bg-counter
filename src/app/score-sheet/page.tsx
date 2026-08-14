"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaPlus,
  FaTrashCan,
} from "react-icons/fa6";
import { useSettings } from "@/context/SettingsContext";
import { NavBar } from "@/features/navbar/NavBar";
import { trackEvent } from "@/lib/telemetry";

type Player = {
  id: string;
  name: string;
};

type ScoreRow = {
  id: string;
  concept: string;
  scores: Record<string, string>;
};

const SCORE_SHEET_STORAGE_KEY = "bg-counter-score-sheet";

const initialPlayers: Player[] = [
  { id: "player-1", name: "" },
  { id: "player-2", name: "" },
];

const initialRows: ScoreRow[] = [
  { id: "concept-1", concept: "", scores: {} },
];

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getInitialScoreSheet = (): {
  players: Player[];
  rows: ScoreRow[];
} => {
  if (typeof window === "undefined") {
    return { players: initialPlayers, rows: initialRows };
  }

  try {
    const storedValue = window.localStorage.getItem(SCORE_SHEET_STORAGE_KEY);
    if (!storedValue) return { players: initialPlayers, rows: initialRows };

    const parsed = JSON.parse(storedValue) as {
      players?: unknown;
      rows?: unknown;
    };
    if (!Array.isArray(parsed.players) || !Array.isArray(parsed.rows)) {
      return { players: initialPlayers, rows: initialRows };
    }

    const players = parsed.players.filter(
      (player): player is Player =>
        typeof player === "object" &&
        player !== null &&
        typeof (player as Player).id === "string" &&
        typeof (player as Player).name === "string",
    );
    const playerIds = new Set(players.map((player) => player.id));
    const rows = parsed.rows
      .filter(
        (row): row is ScoreRow =>
          typeof row === "object" &&
          row !== null &&
          typeof (row as ScoreRow).id === "string" &&
          typeof (row as ScoreRow).concept === "string" &&
          typeof (row as ScoreRow).scores === "object" &&
          (row as ScoreRow).scores !== null,
      )
      .map((row) => ({
        ...row,
        scores: Object.fromEntries(
          Object.entries(row.scores).filter(
            ([playerId, score]) =>
              playerIds.has(playerId) && typeof score === "string",
          ),
        ),
      }));

    return {
      players: players.length > 0 ? players : [initialPlayers[0]],
      rows: rows.length > 0 ? rows : [initialRows[0]],
    };
  } catch {
    return { players: initialPlayers, rows: initialRows };
  }
};

export default function ScoreSheetPage() {
  const { language, t } = useSettings();
  const [initialScoreSheet] = useState(getInitialScoreSheet);
  const [players, setPlayers] = useState<Player[]>(initialScoreSheet.players);
  const [rows, setRows] = useState<ScoreRow[]>(initialScoreSheet.rows);
  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const scrollAfterPlayerAddRef = useRef(false);

  useEffect(() => {
    document.title = `Juernes de Mesa — ${t("scoreSheetTitle")}`;
  }, [t]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SCORE_SHEET_STORAGE_KEY,
        JSON.stringify({ players, rows }),
      );
    } catch {
      // Keep the score sheet working if storage is unavailable.
    }
  }, [players, rows]);

  const totals = useMemo(() => {
    return Object.fromEntries(
      players.map((player) => [
        player.id,
        rows.reduce((total, row) => {
          const score = Number(row.scores[player.id]);
          return total + (Number.isFinite(score) ? score : 0);
        }, 0),
      ]),
    ) as Record<string, number>;
  }, [players, rows]);

  const hasScores = rows.some((row) =>
    Object.values(row.scores).some((score) => score.trim() !== ""),
  );
  const highestScore = Math.max(...players.map((player) => totals[player.id]));
  const winnerIds = new Set(
    hasScores
      ? players
          .filter((player) => totals[player.id] === highestScore)
          .map((player) => player.id)
      : [],
  );
  const winnerNames = players
    .map((player, index) => ({
      id: player.id,
      name: player.name.trim() || `${t("scoreSheetPlayer")} ${index + 1}`,
    }))
    .filter((player) => winnerIds.has(player.id))
    .map((player) => player.name);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(
        language === "es" ? "es-ES" : language === "it" ? "it-IT" : "en-GB",
        { maximumFractionDigits: 2 },
      ),
    [language],
  );

  const addPlayer = () => {
    trackEvent("score_sheet_player_added", {}, { playerCount: players.length + 1 });
    scrollAfterPlayerAddRef.current = true;
    setPlayers((current) => [
      ...current,
      { id: createId("player"), name: "" },
    ]);
  };

  useEffect(() => {
    if (!scrollAfterPlayerAddRef.current) return;
    scrollAfterPlayerAddRef.current = false;

    const animationFrame = window.requestAnimationFrame(() => {
      const container = tableScrollRef.current;
      if (!container) return;
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [players.length]);

  const removePlayer = (playerId: string) => {
    if (players.length === 1) return;
    trackEvent("score_sheet_player_removed", {}, { playerCount: players.length - 1 });
    setPlayers((current) =>
      current.length === 1
        ? current
        : current.filter((player) => player.id !== playerId),
    );
    setRows((current) =>
      current.map((row) => {
        const scores = { ...row.scores };
        delete scores[playerId];
        return { ...row, scores };
      }),
    );
  };

  const addRow = () => {
    trackEvent("score_sheet_row_added", {}, { rowCount: rows.length + 1 });
    setRows((current) => [
      ...current,
      { id: createId("concept"), concept: "", scores: {} },
    ]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length === 1) return;
    trackEvent("score_sheet_row_removed", {}, { rowCount: rows.length - 1 });
    setRows((current) =>
      current.length === 1
        ? current
        : current.filter((row) => row.id !== rowId),
    );
  };

  const clearScores = () => {
    trackEvent("score_sheet_scores_cleared", {}, { playerCount: players.length, rowCount: rows.length });
    setRows((current) => current.map((row) => ({ ...row, scores: {} })));
  };

  const resetScoreSheet = () => {
    trackEvent("score_sheet_reset", {}, { previousPlayerCount: players.length, previousRowCount: rows.length });
    setPlayers([{ id: "player-1", name: "" }]);
    setRows([{ id: "concept-1", concept: "", scores: {} }]);
    tableScrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const updateScore = (rowId: string, playerId: string, score: string) => {
    setRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? { ...row, scores: { ...row.scores, [playerId]: score } }
          : row,
      ),
    );
  };

  return (
    <>
      <NavBar
        right={({ requestClose }) => (
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <button
              type="button"
              onClick={() => {
                clearScores();
                requestClose();
              }}
              disabled={!hasScores}
              className="w-full whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--border)] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto md:border-white/20 md:bg-white/10 md:text-white md:hover:bg-white/20"
            >
              {t("scoreSheetClearScores")}
            </button>
            <button
              type="button"
              onClick={() => {
                resetScoreSheet();
                requestClose();
              }}
              className="w-full whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80 md:w-auto"
            >
              {t("scoreSheetReset")}
            </button>
          </div>
        )}
      />
      <main
        className="bg-[var(--background)] px-2 py-3 text-[var(--foreground)] sm:px-4 sm:py-6"
        style={{
          minHeight:
            "calc(var(--app-vh, 100dvh) - 3.5rem - 3rem - env(safe-area-inset-bottom))",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:gap-5">
          <header>
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                {t("scoreSheetTitle")}
              </h1>
              <p
                className={`mt-1 text-sm font-semibold sm:text-base ${
                  hasScores ? "text-primary" : "text-[var(--text-muted)]"
                }`}
              >
                {hasScores
                  ? `${t(winnerNames.length > 1 ? "scoreSheetTie" : "scoreSheetCurrentWinner")}: ${winnerNames.join(", ")}`
                  : t("scoreSheetWinnerUndecided")}
              </p>
              <p className="mt-2 hidden text-sm leading-6 text-[var(--text-muted)] sm:block">
                {t("scoreSheetDescription")}
              </p>
            </div>
          </header>

          <div
            ref={tableScrollRef}
            className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm sm:rounded-2xl"
          >
            <table className="w-full min-w-max border-collapse">
              <caption className="sr-only">{t("scoreSheetDescription")}</caption>
              <thead>
                <tr className="bg-[var(--surface-muted)]">
                  <th
                    scope="col"
                    className="sticky left-0 z-20 w-36 min-w-36 max-w-36 border-b border-r border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 text-left text-xs font-semibold sm:w-52 sm:min-w-52 sm:max-w-52 sm:px-4 sm:py-3 sm:text-sm"
                  >
                    {t("scoreSheetConcept")}
                  </th>
                  {players.map((player, playerIndex) => (
                    <th
                      key={player.id}
                      scope="col"
                      className="w-28 min-w-28 max-w-28 border-b border-r border-[var(--border)] px-1 py-1.5 last:border-r-0 sm:w-40 sm:min-w-40 sm:max-w-40 sm:px-3 sm:py-2"
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <input
                          value={player.name}
                          onChange={(event) =>
                            setPlayers((current) =>
                              current.map((item) =>
                                item.id === player.id
                                  ? { ...item, name: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          aria-label={`${t("scoreSheetPlayer")} ${playerIndex + 1}`}
                          placeholder={`${t("scoreSheetPlayer")} ${playerIndex + 1}`}
                          className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-1 py-1 text-center text-xs font-semibold outline-none focus:ring-2 focus:ring-primary sm:rounded-md sm:px-2 sm:py-1.5 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removePlayer(player.id)}
                          disabled={players.length === 1}
                          aria-label={`${t("scoreSheetRemovePlayer")} ${playerIndex + 1}`}
                          title={t("scoreSheetRemovePlayer")}
                          className="shrink-0 rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)] sm:p-1.5"
                        >
                          <FaTrashCan aria-hidden size={13} />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="w-px whitespace-nowrap border-b border-[var(--border)] px-1 py-1.5 text-center"
                  >
                    <button
                      type="button"
                      onClick={addPlayer}
                      aria-label={t("scoreSheetAddPlayer")}
                      title={t("scoreSheetAddPlayer")}
                      className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary/80"
                    >
                      <FaPlus aria-hidden />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={row.id}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 w-36 min-w-36 max-w-36 border-b border-r border-[var(--border)] bg-[var(--surface)] px-1.5 py-1 sm:w-52 sm:min-w-52 sm:max-w-52 sm:px-3 sm:py-2"
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <input
                          value={row.concept}
                          onChange={(event) =>
                            setRows((current) =>
                              current.map((item) =>
                                item.id === row.id
                                  ? { ...item, concept: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          aria-label={`${t("scoreSheetConcept")} ${rowIndex + 1}`}
                          placeholder={`${t("scoreSheetConcept")} ${rowIndex + 1}`}
                          className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-primary sm:rounded-md sm:px-2 sm:py-1.5 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length === 1}
                          aria-label={`${t("scoreSheetRemoveConcept")} ${rowIndex + 1}`}
                          title={t("scoreSheetRemoveConcept")}
                          className="shrink-0 rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)] sm:p-1.5"
                        >
                          <FaTrashCan aria-hidden size={13} />
                        </button>
                      </div>
                    </th>
                    {players.map((player, playerIndex) => (
                      <td
                        key={player.id}
                        className="w-28 min-w-28 max-w-28 border-b border-r border-[var(--border)] p-1 last:border-r-0 sm:w-40 sm:min-w-40 sm:max-w-40 sm:p-2"
                      >
                        <input
                          type="number"
                          inputMode="decimal"
                          step="any"
                          value={row.scores[player.id] ?? ""}
                          onChange={(event) =>
                            updateScore(row.id, player.id, event.target.value)
                          }
                          onBlur={(event) =>
                            trackEvent("score_sheet_score_entered", {
                              hasValue: event.target.value.trim() !== "",
                            })
                          }
                          aria-label={`${t("scoreSheetScore")}: ${player.name || `${t("scoreSheetPlayer")} ${playerIndex + 1}`}, ${row.concept || `${t("scoreSheetConcept")} ${rowIndex + 1}`}`}
                          className="score-sheet-number-input w-full min-w-0 rounded border border-[var(--border)] bg-[var(--surface)] px-1 py-1 text-center text-sm tabular-nums outline-none focus:ring-2 focus:ring-primary sm:rounded-md sm:px-3 sm:py-2 sm:text-base"
                        />
                      </td>
                    ))}
                    <td className="w-px border-b border-[var(--border)]" />
                  </tr>
                ))}
                <tr className="bg-[var(--surface-muted)]/50">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 w-36 min-w-36 max-w-36 border-b border-r border-[var(--border)] bg-[var(--surface-muted)] px-1.5 py-1 sm:w-52 sm:min-w-52 sm:max-w-52 sm:px-3 sm:py-2"
                  >
                    <button
                      type="button"
                      onClick={addRow}
                      aria-label={t("scoreSheetAddConcept")}
                      title={t("scoreSheetAddConcept")}
                      className="mx-auto flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] transition-colors hover:bg-[var(--surface-muted)]"
                    >
                      <FaPlus aria-hidden />
                    </button>
                  </th>
                  <td
                    colSpan={players.length + 1}
                    className="border-b border-[var(--border)]"
                  />
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-[var(--surface-muted)]">
                  <th
                    scope="row"
                    className="sticky left-0 z-20 w-36 min-w-36 max-w-36 border-r border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 text-left text-sm font-bold sm:w-52 sm:min-w-52 sm:max-w-52 sm:px-4 sm:py-4 sm:text-base"
                  >
                    {t("scoreSheetTotal")}
                  </th>
                  {players.map((player) => {
                    const isWinner = winnerIds.has(player.id);
                    return (
                      <td
                        key={player.id}
                        title={isWinner ? t("scoreSheetWinner") : undefined}
                        className={`w-28 min-w-28 max-w-28 border-r border-[var(--border)] px-2 py-2 text-center text-base tabular-nums last:border-r-0 sm:w-40 sm:min-w-40 sm:max-w-40 sm:px-4 sm:py-4 sm:text-xl ${
                          isWinner
                            ? "bg-primary/5 font-bold text-primary"
                            : "font-semibold"
                        }`}
                      >
                        {numberFormatter.format(totals[player.id])}
                      </td>
                    );
                  })}
                  <td className="w-px" />
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-center text-xs text-[var(--text-muted)] sm:text-left sm:text-sm">
            {t("scoreSheetClearHint")}
          </p>

        </div>
        <style jsx global>{`
          .score-sheet-number-input::-webkit-inner-spin-button,
          .score-sheet-number-input::-webkit-outer-spin-button {
            margin: 0;
            appearance: none;
          }
          .score-sheet-number-input {
            appearance: textfield;
          }
        `}</style>
      </main>
    </>
  );
}
