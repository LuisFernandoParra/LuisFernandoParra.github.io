import { useEffect } from 'react';
import { siteUrl } from '@/data/shared';
import type { Locale } from '@/types/content';

interface Meta {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Título, descripción, Open Graph, canonical y hreflang por ruta e idioma. */
export function useDocumentMeta({
  title,
  description,
  path,
  locale,
  image = '/og.png',
}: Meta): void {
  useEffect(() => {
    const url = `${siteUrl}${path}`;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', `${siteUrl}${image}`);
    setMeta('property', 'og:locale', locale === 'es' ? 'es_CO' : 'en_US');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', `${siteUrl}${image}`);
    setLink('canonical', locale === 'es' ? url : `${url}?lang=en`);
    setLink('alternate', `${url}?lang=es`, 'es');
    setLink('alternate', `${url}?lang=en`, 'en');
    setLink('alternate', url, 'x-default');
  }, [title, description, path, locale, image]);
}
