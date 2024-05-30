export default function Home() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/en-US/elytestpage',
      permanent: false,
    },
  };
}
