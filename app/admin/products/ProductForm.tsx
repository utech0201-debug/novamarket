"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { categories, type Product } from "@/lib/products";

type ActionState = { error?: string } | void;
type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: Action;
  product?: Product;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="w-full rounded-xl border border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Price (USD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            className="w-full rounded-xl border border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            name="category"
            defaultValue={product?.category ?? "Men"}
            className="w-full rounded-xl border border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink"
          >
            {categories
              .filter((c) => c !== "All")
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Image URL</label>
        <input
          name="image"
          type="url"
          defaultValue={product?.image}
          placeholder="https://…"
          className="w-full rounded-xl border border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description}
          className="w-full rounded-xl border border-ink/20 bg-cream px-4 py-3 outline-none focus:border-ink"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={product?.featured}
          className="h-4 w-4"
        />
        Featured on homepage
      </label>

      {state?.error && (
        <p className="rounded-xl bg-accent/10 p-3 text-sm text-accent-dark">
          {state.error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <SubmitButton label={submitLabel} />
        <Link href="/admin/products" className="btn-outline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
