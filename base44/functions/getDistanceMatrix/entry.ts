import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { origins, destinations } = await req.json();
  const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&mode=driving&units=metric&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  const element = data?.rows?.[0]?.elements?.[0];
  if (!element || element.status !== 'OK') {
    return Response.json({ error: 'Could not calculate distance', details: element?.status }, { status: 400 });
  }

  return Response.json({
    distance_km: element.distance.value / 1000,
    distance_text: element.distance.text,
    duration_text: element.duration.text,
  });
});