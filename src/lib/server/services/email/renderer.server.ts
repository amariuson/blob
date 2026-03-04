import type { Component, ComponentProps } from 'svelte';

import Renderer, { toPlainText } from 'better-svelte-email/render';

const renderer = new Renderer();

type EmailComponent<P extends Record<string, unknown>> = Component<P>;

export async function renderEmail<P extends Record<string, unknown>>(
	component: EmailComponent<P>,
	props: ComponentProps<EmailComponent<P>>
): Promise<{ html: string; text: string }> {
	const html = await renderer.render(component, { props });
	const text = toPlainText(html);

	return { html, text };
}
