if [ vercel-deployments = main ] || [ false ]; then
  vercel pull --yes --environment=production --token=***
  vercel build --prod --token=***
  vercel deploy --prod --prebuilt --token=***
else
  vercel pull --yes --environment=preview --token=***
  vercel build --token=***
  vercel deploy --prebuilt --token=***
fi    