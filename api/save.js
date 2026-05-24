export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const body = req.body;

    const response = await fetch(`${supabaseUrl}/rest/v1/diagnostics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: body.name || '',
        role: body.role || '',
        org: body.org || '',
        industry: body.industry || '',
        email: body.email || '',
        phone: body.phone || '',
        org_size: body.org_size || '',
        score_leadership: body.score_leadership || 0,
        score_kpi: body.score_kpi || 0,
        score_signal: body.score_signal || 0,
        score_consumer: body.score_consumer || 0,
        score_ops: body.score_ops || 0,
        score_trust: body.score_trust || 0,
        score_ppi: body.score_ppi || 0,
        score_ecosystem: body.score_ecosystem || 0,
        total_score: body.total_score || 0,
        tier: body.tier || '',
        open_leadership: body.open_leadership || '',
        open_kpi: body.open_kpi || '',
        open_signal: body.open_signal || '',
        open_consumer: body.open_consumer || '',
        open_ops: body.open_ops || '',
        open_trust: body.open_trust || '',
        open_ppi: body.open_ppi || '',
        open_ecosystem: body.open_ecosystem || '',
        rx_report: body.rx_report || '',
        status: 'new',
        flagged: false,
        notes: ''
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });
    return res.status(200).json({ success: true, id: data[0]?.id });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
