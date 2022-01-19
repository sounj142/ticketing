export default function Index({ currentUser, aaaa, bbb }) {
  if (currentUser) {
    return <h1>You are signed in</h1>;
  }
  return <h1>You are not signed in</h1>;
}

Index.getInitialProps = () => {
  return { aaaa: 999, bbb: 'aaa cx xxxx' };
};
