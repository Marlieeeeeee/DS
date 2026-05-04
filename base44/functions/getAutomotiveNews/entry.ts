import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const apiKey = Deno.env.get('NEWS_API_KEY');
  const url = `https://newsapi.org/v2/everything?q=automotive+cars+india&language=en&sortBy=publishedAt&pageSize=4&apiKey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'ok') {
    return Response.json({ error: 'News API error', details: data.message }, { status: 400 });
  }

  const articles = (data.articles || []).map((a) => ({
    id: a.url,
    title: a.title,
    source: a.source?.name || 'News',
    time: new Date(a.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    image_url: a.urlToImage || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=320&fit=crop',
    article_url: a.url,
    body: a.description || a.content || '',
  }));

  return Response.json({ articles });
});