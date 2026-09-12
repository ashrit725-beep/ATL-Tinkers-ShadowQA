import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { fetchFaq, fetchOrders, submitSupport } from "../api/store";
import { Field, PageHeader } from "../components/Field";

function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="bg-white border border-line divide-y divide-line reveal" data-testid="help-faq">
      {items.map((f, i) => (
        <div key={f.q}>
          <button type="button" className="w-full flex items-center justify-between gap-4 p-5 text-left" onClick={() => setOpen(open === i ? -1 : i)} data-testid={`faq-toggle-${i}`} aria-expanded={open === i}>
            <span className="text-sm font-medium text-ink">{f.q}</span>
            <ChevronDown size={16} className={`text-mute transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <p className="px-5 pb-5 text-sm text-ink2 leading-relaxed" data-testid={`faq-answer-${i}`}>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

export default function Help() {
  const [params] = useSearchParams();
  const [faq, setFaq] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "", order_id: params.get("order") || "" });
  const [ticket, setTicket] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchFaq().then((d) => setFaq(d.faq || []));
    fetchOrders().then((d) => setOrders(d.orders || []));
  }, []);

  const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const send = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await submitSupport({ subject: form.subject, message: form.message, order_id: form.order_id || null });
      setTicket(res.ticket);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="help-page">
      <PageHeader eyebrow="Help & support" title={<>How can we <span className="italic font-light">help?</span></>} />
      <div className="grid lg:grid-cols-5 gap-10">
        <section className="lg:col-span-3">
          <h2 className="font-display text-lg text-ink mb-4">Frequently asked</h2>
          <Faq items={faq} />
        </section>
        <aside className="lg:col-span-2 reveal reveal-1">
          <div className="bg-white border border-line p-6">
            <h2 className="font-display text-lg text-ink mb-5">Write to the workshop</h2>
            {ticket ? (
              <div data-testid="support-confirmation">
                <div className="eyebrow mb-2">Ticket opened</div>
                <p className="font-mono text-ink" data-testid="support-ticket-id">{ticket.id}</p>
                <p className="mt-2 text-sm text-ink2">We reply within one business day to {ticket.email}.</p>
                <button className="btn-ghost mt-6" onClick={() => { setTicket(null); setForm({ subject: "", message: "", order_id: "" }); }} data-testid="support-another-btn">Send another</button>
              </div>
            ) : (
              <form onSubmit={send} className="space-y-4" data-testid="support-form">
                <label className="block">
                  <span className="block text-xs font-medium text-ink2 mb-1.5">Related order (optional)</span>
                  <select name="order_id" className="field" value={form.order_id} onChange={update} data-testid="support-order">
                    <option value="">No specific order</option>
                    {orders.map((o) => <option key={o.id} value={o.id}>{o.id} · {o.status}</option>)}
                  </select>
                </label>
                <Field label="Subject" id="sup-subject" name="subject" testid="support-subject" value={form.subject} onChange={update} required minLength={3} placeholder="Sheath stitching on my hatchet" />
                <label className="block">
                  <span className="block text-xs font-medium text-ink2 mb-1.5">Message</span>
                  <textarea name="message" className="field min-h-[120px]" value={form.message} onChange={update} required minLength={10} data-testid="support-message" placeholder="Tell us what happened…" />
                </label>
                <button type="submit" className="btn-ink w-full" disabled={busy} data-testid="support-submit-btn">{busy ? "Sending…" : "Send message"}</button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
