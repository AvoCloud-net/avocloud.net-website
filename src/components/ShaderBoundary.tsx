import { Component, type ReactNode } from 'react';

/* ---------------------------------------------------------------------------
   ShaderBoundary — catches a failed load of the lazy dither shader.

   The shader is a dynamic import. When that chunk cannot be fetched (a tab
   left open across a deploy asks for a file name that no longer exists, a
   flaky connection, the dev server re-optimising its deps), React.lazy
   throws, and without a boundary React unmounts the whole island: the closing
   scene on /craftattack/ vanished, copy and buttons included. The texture is
   decoration, so on failure it simply is not drawn.
--------------------------------------------------------------------------- */
export class ShaderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
