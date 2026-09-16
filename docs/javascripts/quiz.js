(() => {
  const LETTERS = ["A", "B", "C", "D"];

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function renderCode(code) {
    if (!code) {
      return "";
    }
    return `<pre class="dwec-quiz__code" tabindex="0"><code>${escapeHtml(code)}</code></pre>`;
  }

  function optionId(quizId, qIndex, oIndex) {
    return `${quizId}-q${qIndex}-o${oIndex}`;
  }

  function selectedIndex(form, qIndex) {
    const chosen = form.querySelector(`input[name="q${qIndex}"]:checked`);
    return chosen ? Number(chosen.value) : null;
  }

  function scoreMessage(ok, total, unit) {
    const ratio = ok / total;
    const donde = unit || "la unidad";
    if (ok === total) {
      return "Excelente: todas correctas. Puedes pasar a las prácticas de Moodle.";
    }
    if (ratio >= 0.75) {
      return "Muy bien. Repasa solo las preguntas falladas (enlace al apartado al final de cada una).";
    }
    if (ratio >= 0.5) {
      return "Vas por el camino, pero conviene volver a los apartados enlazados antes de un examen.";
    }
    return `Mejor recorre de nuevo la ${donde} y reintenta el test. No puntúa en Moodle: es para practicar.`;
  }

  function fieldsetOf(form, qIndex) {
    return form.querySelector(`fieldset[data-index="${qIndex}"]`);
  }

  function isGraded(form, qIndex) {
    const fieldset = fieldsetOf(form, qIndex);
    return Boolean(fieldset) && fieldset.classList.contains("dwec-quiz__question--graded");
  }

  function renderForm(data, quizId) {
    const items = data.questions
      .map((q, qIndex) => {
        const opts = q.options
          .map((opt, oIndex) => {
            const id = optionId(quizId, qIndex, oIndex);
            return `<label class="dwec-quiz__option" for="${id}">
              <input type="radio" name="q${qIndex}" id="${id}" value="${oIndex}" required>
              <span class="dwec-quiz__letter">${LETTERS[oIndex]}</span>
              <span class="dwec-quiz__option-text">${escapeHtml(opt)}</span>
            </label>`;
          })
          .join("");
        return `<fieldset class="dwec-quiz__question" data-index="${qIndex}">
          <legend class="dwec-quiz__legend">
            <span class="dwec-quiz__num">${qIndex + 1} / ${data.questions.length}</span>
            <span class="dwec-quiz__topic">${escapeHtml(q.topic)}</span>
          </legend>
          <p class="dwec-quiz__prompt">${escapeHtml(q.prompt)}</p>
          ${renderCode(q.code)}
          <div class="dwec-quiz__options">${opts}</div>
          <div class="dwec-quiz__actions dwec-quiz__actions--question">
            <button type="button" class="md-button dwec-quiz__check" data-qindex="${qIndex}" disabled>Comprobar respuesta</button>
          </div>
          <div class="dwec-quiz__feedback" hidden></div>
        </fieldset>`;
      })
      .join("");

    return `<form class="dwec-quiz__form" novalidate>
      <div class="dwec-quiz__result" hidden></div>
      ${items}
      <p class="dwec-quiz__progress" aria-live="polite"></p>
      <div class="dwec-quiz__actions">
        <button type="submit" class="md-button md-button--primary dwec-quiz__submit">Corregir test</button>
        <button type="button" class="md-button dwec-quiz__reset" hidden>Volver a intentar</button>
      </div>
    </form>`;
  }

  function updateProgress(form, total) {
    const answered = form.querySelectorAll("input[type=radio]:checked").length;
    const graded = form.querySelectorAll(".dwec-quiz__question--graded").length;
    const bar = form.querySelector(".dwec-quiz__progress");
    bar.textContent = `Respondidas: ${answered} / ${total} · Corregidas: ${graded} / ${total}`;
  }

  function gradeQuestion(form, data, qIndex) {
    if (isGraded(form, qIndex)) {
      return;
    }
    const q = data.questions[qIndex];
    const fieldset = fieldsetOf(form, qIndex);
    const picked = selectedIndex(form, qIndex);
    const correct = picked === q.answer;
    fieldset.classList.add("dwec-quiz__question--graded");
    fieldset.classList.toggle("dwec-quiz__question--ok", correct);
    fieldset.classList.toggle("dwec-quiz__question--ko", !correct);
    fieldset.querySelectorAll(".dwec-quiz__option").forEach((label, oIndex) => {
      label.classList.toggle("dwec-quiz__option--correct", oIndex === q.answer);
      label.classList.toggle("dwec-quiz__option--picked", oIndex === picked && !correct);
    });
    fieldset.querySelectorAll("input[type=radio]").forEach((input) => {
      input.disabled = true;
    });
    const check = fieldset.querySelector(".dwec-quiz__check");
    if (check) {
      check.hidden = true;
    }
    const box = fieldset.querySelector(".dwec-quiz__feedback");
    const letter = LETTERS[q.answer];
    const href = q.href ? `<p class="dwec-quiz__more"><a href="${escapeHtml(q.href)}">Repasar ${escapeHtml(q.topic)}</a></p>` : "";
    const yours =
      picked === null
        ? "<p>No marcaste ninguna opción.</p>"
        : correct
          ? "<p><strong>Correcta.</strong></p>"
          : `<p><strong>Incorrecta.</strong> Marcaste la ${LETTERS[picked]}.</p>`;
    box.hidden = false;
    box.innerHTML = `${yours}<p>La respuesta correcta es la <strong>${letter}</strong>.</p><p>${escapeHtml(q.explain)}</p>${href}`;
  }

  function showResult(form, data) {
    const total = data.questions.length;
    const graded = form.querySelectorAll(".dwec-quiz__question--graded").length;
    if (graded < total) {
      return false;
    }
    const ok = form.querySelectorAll(".dwec-quiz__question--ok").length;
    form.querySelectorAll("input[type=radio]").forEach((input) => {
      input.disabled = true;
    });
    form.querySelectorAll(".dwec-quiz__check").forEach((btn) => {
      btn.hidden = true;
    });
    form.querySelector(".dwec-quiz__submit").hidden = true;
    form.querySelector(".dwec-quiz__reset").hidden = false;

    const result = form.querySelector(".dwec-quiz__result");
    result.hidden = false;
    result.innerHTML = `<p class="dwec-quiz__score">Resultado: <strong>${ok} / ${total}</strong></p><p>${escapeHtml(scoreMessage(ok, total, data.unit))}</p>`;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }

  function bindForm(form, data, render) {
    const total = data.questions.length;
    updateProgress(form, total);

    form.addEventListener("change", (event) => {
      updateProgress(form, total);
      const input = event.target.closest("input[type=radio]");
      if (input) {
        const fieldset = input.closest("fieldset");
        const check = fieldset?.querySelector(".dwec-quiz__check");
        if (check && !fieldset.classList.contains("dwec-quiz__question--graded")) {
          check.disabled = false;
        }
      }
    });

    form.addEventListener("click", (event) => {
      const check = event.target.closest(".dwec-quiz__check");
      if (!check || check.disabled || check.hidden) {
        return;
      }
      const qIndex = Number(check.dataset.qindex);
      if (selectedIndex(form, qIndex) === null) {
        return;
      }
      gradeQuestion(form, data, qIndex);
      updateProgress(form, total);
      const feedback = fieldsetOf(form, qIndex)?.querySelector(".dwec-quiz__feedback");
      if (!showResult(form, data) && feedback) {
        feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const pending = data.questions
        .map((_, i) => i)
        .filter((i) => !isGraded(form, i) && selectedIndex(form, i) === null);
      if (pending.length > 0) {
        fieldsetOf(form, pending[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
        const answered = form.querySelectorAll("input[type=radio]:checked").length;
        const graded = form.querySelectorAll(".dwec-quiz__question--graded").length;
        form.querySelector(".dwec-quiz__progress").textContent =
          `Te faltan ${pending.length} sin responder: llevas ${answered} respondidas y ${graded} corregidas.`;
        return;
      }
      data.questions.forEach((_, i) => gradeQuestion(form, data, i));
      updateProgress(form, total);
      showResult(form, data);
    });

    form.querySelector(".dwec-quiz__reset").addEventListener("click", () => {
      render();
    });
  }

  async function mount(root) {
    if (root.dataset.ready === "1") {
      return;
    }
    const src = root.dataset.src;
    if (!src) {
      return;
    }
    root.dataset.ready = "1";
    root.innerHTML = "<p>Cargando el test…</p>";
    try {
      const url = new URL(src, window.location.href);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(String(response.status));
      }
      const data = await response.json();
      if (!root.isConnected) {
        root.dataset.ready = "0";
        return;
      }
      const quizId = `quiz-${Math.random().toString(36).slice(2, 8)}`;

      const draw = () => {
        root.innerHTML = renderForm(data, quizId);
        const form = root.querySelector("form");
        const result = form.querySelector(".dwec-quiz__result");
        result.setAttribute("tabindex", "-1");
        bindForm(form, data, draw);
      };
      draw();
    } catch (error) {
      root.dataset.ready = "0";
      root.innerHTML = `<p>No se ha podido cargar el test. Recarga la página. (${escapeHtml(error.message)})</p>`;
    }
  }

  function init() {
    document.querySelectorAll("[data-dwec-quiz]").forEach((node) => {
      mount(node);
    });
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
