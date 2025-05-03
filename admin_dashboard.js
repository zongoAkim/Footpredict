const { useState } = React;

export default function AdminDashboard() {
  const [match, setMatch] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const authenticate = () => {
    if (login === "admin" && password === "secure123") {
      setAuthenticated(true);
    } else {
      alert("Identifiants incorrects");
    }
  };

  const getPrediction = async () => {
    if (!match.includes(" vs ")) return;
    setLoading(true);
    try {
      const res = await fetch("https://footpredict-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match })
      });
      const data = await res.json();
      if (res.ok) setPredictions(prev => [data, ...prev]);
      else alert(data.detail || "Erreur de prédiction");
    } catch {
      alert("Erreur de connexion serveur");
    }
    setLoading(false);
  };

  if (!authenticated) {
    return React.createElement("div", { style: { padding: 20 } },
      React.createElement("h2", null, "Connexion Admin"),
      React.createElement("input", {
        placeholder: "Identifiant",
        value: login,
        onChange: e => setLogin(e.target.value)
      }),
      React.createElement("input", {
        placeholder: "Mot de passe",
        type: "password",
        value: password,
        onChange: e => setPassword(e.target.value)
      }),
      React.createElement("button", { onClick: authenticate }, "Se connecter")
    );
  }

  return React.createElement("div", { style: { padding: 20 } },
    React.createElement("h1", null, "Dashboard FootPredict"),
    React.createElement("input", {
      placeholder: "Match (ex: PSG vs OM)",
      value: match,
      onChange: e => setMatch(e.target.value)
    }),
    React.createElement("button", { onClick: getPrediction, disabled: loading }, loading ? "Chargement..." : "Prédire"),
    predictions.map((p, i) => React.createElement("div", { key: i, style: { marginTop: 20 } },
      React.createElement("h3", null, `${p.homeTeam} vs ${p.awayTeam}`),
      React.createElement("p", null, `Mi-temps: ${p.prediction.halftimeScore}`),
      React.createElement("p", null, `Score final: ${p.prediction.fulltimeScore}`),
      React.createElement("p", null, `Corners: ${p.prediction.corners.home}-${p.prediction.corners.away} (Total: ${p.prediction.corners.total})`),
      React.createElement("p", null, `Chances: ${p.prediction.chance.homeWin}% - ${p.prediction.chance.draw}% - ${p.prediction.chance.awayWin}%`),
      React.createElement("ul", null, p.prediction.safeBets.map((bet, j) => React.createElement("li", { key: j }, bet)))
    ))
  );
}