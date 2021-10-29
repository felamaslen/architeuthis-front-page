import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentInitialProps,
    DocumentContext,
} from 'next/document';
import * as React from 'react';
import { renderStatic } from '../shared/renderer';

export default class AppComponent extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const page = await ctx.renderPage();
        const { css, ids } = await renderStatic(page.html);
        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: (
                <>
                    {initialProps.styles}
                    <style
                        data-emotion={`css ${ids.join(' ')}`}
                        dangerouslySetInnerHTML={{ __html: css }}
                    />
                </>
            ),
        };
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
