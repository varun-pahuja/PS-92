/**
 * A localisable message: a dictionary key plus optional interpolation params.
 *
 * Domain logic (the recommender engine, the router) returns messages in this
 * shape instead of English strings, so the exact same reasoning trail can be
 * rendered in English or Hindi by the UI — the engine never needs to know
 * which language is active.
 */
export interface IMessage {
  key: string;
  params?: Record<string, string | number>;
}

export const msg = (
  key: string,
  params?: Record<string, string | number>,
): IMessage => ({ key, params });
