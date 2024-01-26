"use client";

import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { spinner } from "@nextui-org/react";

interface Developer {
  id: number;
  name: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [devs, setDevs] = useState<Developer[]>([]);

  useEffect(() => {
    LoadDevs();
  }, []);

  async function LoadDevs() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const response = await api.get("http://localhost:3333/developers");
      setDevs(response.data);
    } catch (error) {
      alert("Erro ao carregar os devs");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddDev() {
    const data = { name: textInput };

    try {
      const response = await api.post("http://localhost:3333/developers", data);
      LoadDevs();
      console.log("Dev cadastrado com sucesso", response);
    } catch (error) {
      alert("Erro ao cadastrar o dev");
    }
  }

  async function handleDeleteDev(id: number) {
    try {
      await api.delete(`http://localhost:3333/developers/${id}`);
      LoadDevs();
      console.log("Dev excluído com sucesso");
    } catch (error) {
      alert("Erro ao excluir o dev");
    }
  }

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-3xl font-bold mb-4">Developers</h1>

        <div className="mt-4">
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Nome do desenvolvedor"
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button
            className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            onClick={handleAddDev}
          >
            Adicionar
          </button>
        </div>
        <ul>
          {devs.map((dev) => (
            <li key={dev.id} className="mb-2 flex items-center justify-between">
              <span>{dev.name}</span>
              <button
                className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => handleDeleteDev(dev.id)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
      {loading && <p className="absolute bottom-4">Carregando...</p>}
    </main>
  );
}
