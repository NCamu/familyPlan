cd backend/ || exit
npm run start &
sleep 5

cd ../frontend/ || exit
npm run dev
