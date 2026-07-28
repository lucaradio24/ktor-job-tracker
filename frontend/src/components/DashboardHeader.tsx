"use client";

import NewApplicationModal from "@/components/NewApplicationModal";
import { useState } from "react";
import NewApplicationForm from "./NewApplicationForm";

export default function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="dashboard-header">
      <div className="header-copy">
        <span className="eyebrow">La tua ricerca, in ordine</span>
        <h1>Le tue candidature</h1>
        <p>Un passo alla volta verso il prossimo lavoro.</p>
      </div>

      <button
        className="new-application-button"
        type="button"
        onClick={() => setIsModalOpen(true)}
        title="Apri il form per una nuova candidatura"
      >
        <span aria-hidden="true">+</span>
        Nuova candidatura
      </button>

      <NewApplicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <NewApplicationForm onCancel={() => setIsModalOpen(false)} />
      </NewApplicationModal>

      <div className="hero-illustration" aria-hidden="true">
        <span className="hero-cloud" />
        <span className="hero-dot hero-dot-lilac" />
        <span className="hero-dot hero-dot-yellow" />
        <div className="hero-character">
          <span className="hero-eye hero-eye-left" />
          <span className="hero-eye hero-eye-right" />
          <span className="hero-smile" />
        </div>
        <div className="hero-laptop">
          <span />
        </div>
        <div className="hero-plant">
          <span className="plant-pot" />
          <span className="plant-stem" />
          <span className="plant-leaf plant-leaf-left" />
          <span className="plant-leaf plant-leaf-right" />
        </div>
        <span className="hero-shadow" />
      </div>
    </header>
  );
}
