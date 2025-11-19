import React from 'react';
// no external links needed in this file
import { motion } from 'framer-motion';
import bgUrl from '../assets/sunset.webp';
import bastelImg from '../assets/Bastelwerkstatt.webp';
import historyImg from '../assets/history.webp';
import begeisterungImg from '../assets/begeisterung.webp';
import werkeImg from '../assets/werke.webp';

const history = [
  {
    name: 'Was ist Steampunk?',
    tagline: '"Zeitreisen aus einer Vergangenheit,\ndie es so nicht gab,\nin eine Zukunft,\ndie es so nicht geben wird.',
    bio: '\nVor dem Zeitalter der Mikro-Maschinerie, vor der Domestizierung der Elektrizität und desVerbrennungsmotors, gab es wundervoll monströse Maschinen, die lebten und atmeten undunvehofft explodierten.\n\nEs war die Zeit, in der Kunst und Handwerk eins waren, in der technischeWunder erfunden und wieder vergessen wurden. Es war die Zeit, die es so leider nie gegeben hat."',
     image: historyImg,
  },
  {
    name: 'Ursprung und literarisches Fundament',
    bio: '\nSteampunk entstand in den 1980er Jahren als literarisches Genre, das die Technikfantasien der viktorianischen Zeit mit alternativen Zukunftsentwürfen verknüpft.\n\nNeben internationalen Vorbildern wie Verne und Wells prägten im deutschsprachigen Raum Autoren wie Walter Moers und Kai Meyer die ästhetische Richtung.\n\nDurch Übersetzungen, Anthologien und wachsende Fanprojekte entwickelte sich daraus schnell eine Kultur, die der Frage nachgeht, wie eine Zukunft ausgesehen hätte, wenn Dampfmaschinen, Zahnräder und Mechanik die dominante Technologie geblieben wären.',
    image: werkeImg,
  },
  {
    name: 'Warum Steampunk Menschen begeistert – Mode, Identität & Szene in Deutschland',
    bio: '\nViele Menschen fasziniert Steampunk, weil es historische Eleganz mit futurischer Fantasie verbindet und viel Raum für eigene Identität lässt. In Deutschland prägt vor allem die Mode – von viktorianischen Silhouetten bis zu Messing- und Lederaccessoires – das Bild einer lebendigen Szene.\n\nAuf Events wie dem Aethercircus, der EuroSteamCon oder dem Wave-Gotik-Treffen entstehen Welten, in denen Besucher:innen als Erfinder, Mechanikerinnen oder Luftschiffer in alternative Realitäten eintauchen. Der Reiz liegt darin, diese Rollen und Outfits selbst zu gestalten und über Jahre weiterzuentwickeln – eine Mischung aus Nostalgie, Kreativität und Gemeinschaft.',
     image: begeisterungImg,
  },
  {
    name: 'Bastelkultur, deutsche Maker-Szene und zugängliche Ressourcen',
    bio: '\nSteampunk ist in Deutschland besonders durch seine aktive Bastlerkultur verwurzelt, die Kunsthandwerk, Tüftelei und Upcycling verbindet. Viele entdecken das Genre, weil sie alte Geräte, Metall, Holz oder Leder in fantasievolle Maschinen und Accessoires verwandeln möchten.\n\nIn FabLabs, Makerspaces und Hackspaces – etwa in Berlin, Hamburg oder Wien – entstehen regelmäßig Workshops und Projekte, die in Blogs, auf YouTube und in Foren wie dem ehemaligen „Clockworker“-Portal dokumentiert werden. Auch Magazine wie „Nautilus“ oder diverse DIY-Communities halten die Szene lebendig.\n\nDer besondere Reiz liegt darin, dass sichtbare Zahnräder, Patina und Gebrauchsspuren nicht als Fehler gelten, sondern als Teil einer Handwerksästhetik, die Geschichten erzählt und zeitlos wirkt.',
    image: bastelImg,
  },
];

const History: React.FC = () => {
  return (
    <div className="min-h-screen px-4 pb-20">
      {/* Hero */}
      <section className="relative h-[56vh] md:h-[48vh] flex items-center">
        <div
          className="absolute left-1/2 top-0 w-screen -translate-x-1/2 h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgUrl})`, filter: 'brightness(0.45)' }}
          aria-hidden
        />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-heading font-bold text-theme mb-4"
          >
            Die Geschichte des Steampunk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-theme-80 max-w-3xl mx-auto"
          >
            Geschichten, Inspirationen und die Welt hinter unserem Stil.
          </motion.p>
        </div>
      </section>

      {/* Content (copied from About layout) */}
      <section className="mx-auto max-w-5xl px-4 mt-12 space-y-16">
        {history.map((m, i) => (
          <div
            key={m.name}
            className={`flex flex-col md:flex-row items-stretch gap-6 md:gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="md:w-1/2 h-64 md:h-auto flex">
              <img src={m.image} alt={m.name} className="w-full h-full object-cover rounded-lg shadow-md" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl font-heading font-semibold text-theme mb-2">{m.name}</h3>
              <p className="text-theme-80 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{m.bio}</p>
                {m.tagline && (
                <p className="text-3xl font-heading font-semibold text-brass mb-3 mt-8 text-center" style={{ whiteSpace: 'pre-wrap' }}>
                  {m.tagline}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

     
    </div>
  );
};

export default History;
