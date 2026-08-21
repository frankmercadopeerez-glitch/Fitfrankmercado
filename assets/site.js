(function () {
  "use strict";

  var config = window.FMF_CONFIG || {};
  var lang = document.documentElement.lang === "es-US" ? "es" : "en";

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var menuButton = document.querySelector("[data-menu-button]");
  var menu = document.querySelector("[data-menu]");
  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuButton.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      });
    });
  }

  var checkoutMap = {
    free: config.freeGuideUrl,
    personal: config.personalPlanPaymentUrl
  };

  document.querySelectorAll("[data-checkout]").forEach(function (link) {
    var checkoutType = link.getAttribute("data-checkout");
    var checkoutUrl = checkoutMap[checkoutType] || "";
    var checkoutEnabled = checkoutType === "personal"
      ? config.personalPlanPaymentEnabled === true
      : config.freeCheckoutEnabled === true;
    var isPending = !checkoutEnabled || !checkoutUrl || checkoutUrl.indexOf("REPLACE_") !== -1;

    if (isPending) {
      var subject = checkoutType === "personal"
        ? (lang === "es" ? "Consulta sobre mi plan personalizado" : "Question about my custom training plan")
        : (lang === "es" ? "Quiero la guía gratuita ShiftStarter" : "I want the free ShiftStarter guide");
      link.href = "mailto:" + (config.supportEmail || "frankmercadopeerez@gmail.com") + "?subject=" + encodeURIComponent(subject);
      link.setAttribute("data-checkout-pending", "true");
      link.textContent = checkoutType === "personal"
        ? (lang === "es" ? "Consultar antes de pagar" : "Ask before paying")
        : (lang === "es" ? "Avísame cuando abra la descarga" : "Tell me when downloads open");
    } else {
      link.href = checkoutUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });

  var intakeForm = document.querySelector("[data-intake-form]");
  if (intakeForm) {
    var endpoint = config.formspreeEndpoint || "";
    var enabled = config.intakeEnabled === true && endpoint && endpoint.indexOf("REPLACE_") === -1;
    var submitButton = intakeForm.querySelector("button[type='submit']");
    var status = document.querySelector("[data-intake-status]");

    if (enabled) {
      intakeForm.action = endpoint;
    } else {
      intakeForm.action = "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = lang === "es" ? "Formulario en activación" : "Form activation pending";
      }
      if (status) {
        status.hidden = false;
        status.innerHTML = lang === "es"
          ? "<strong>El formulario todavía no está recibiendo solicitudes.</strong><p>No pagues hasta que este aviso desaparezca. Puedes escribir a <a href='mailto:" + (config.supportEmail || "frankmercadopeerez@gmail.com") + "'>soporte</a>.</p>"
          : "<strong>The intake form is not accepting submissions yet.</strong><p>Do not pay until this notice disappears. You can <a href='mailto:" + (config.supportEmail || "frankmercadopeerez@gmail.com") + "'>email support</a>.</p>";
      }
    }
  }

  document.querySelectorAll("a[target='_blank']").forEach(function (link) {
    var rel = (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
    ["noopener", "noreferrer"].forEach(function (value) {
      if (rel.indexOf(value) === -1) rel.push(value);
    });
    link.setAttribute("rel", rel.join(" "));
  });

  var bmiForm = document.querySelector("[data-bmi-form]");
  if (bmiForm) {
    var unitButtons = Array.from(bmiForm.querySelectorAll("[data-unit]"));
    var metricFields = bmiForm.querySelector("[data-metric-fields]");
    var imperialFields = bmiForm.querySelector("[data-imperial-fields]");
    var unit = "metric";

    function setUnit(nextUnit) {
      unit = nextUnit;
      unitButtons.forEach(function (button) {
        var active = button.getAttribute("data-unit") === unit;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      if (metricFields && imperialFields) {
        metricFields.hidden = unit !== "metric";
        imperialFields.hidden = unit !== "imperial";
      }
    }

    unitButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setUnit(button.getAttribute("data-unit"));
      });
    });

    bmiForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var adult = bmiForm.querySelector("[name='adult']");
      var result = document.querySelector("[data-bmi-result]");
      if (!result) return;

      if (!adult || !adult.checked) {
        result.hidden = false;
        result.innerHTML = "<strong>" + (lang === "es" ? "Esta herramienta es solo para adultos de 20 años o más." : "This tool is only for adults age 20 or older.") + "</strong>";
        return;
      }

      var bmi;
      if (unit === "metric") {
        var kilograms = Number(bmiForm.elements.kilograms.value);
        var centimeters = Number(bmiForm.elements.centimeters.value);
        bmi = kilograms / Math.pow(centimeters / 100, 2);
      } else {
        var pounds = Number(bmiForm.elements.pounds.value);
        var feet = Number(bmiForm.elements.feet.value);
        var inches = Number(bmiForm.elements.inches.value);
        var totalInches = feet * 12 + inches;
        bmi = 703 * pounds / Math.pow(totalInches, 2);
      }

      if (!Number.isFinite(bmi) || bmi < 10 || bmi > 80) {
        result.hidden = false;
        result.innerHTML = "<strong>" + (lang === "es" ? "Revisa los valores e inténtalo de nuevo." : "Check your values and try again.") + "</strong>";
        return;
      }

      var category;
      if (bmi < 18.5) category = lang === "es" ? "por debajo del rango de referencia" : "below the reference range";
      else if (bmi < 25) category = lang === "es" ? "dentro del rango de referencia" : "within the reference range";
      else if (bmi < 30) category = lang === "es" ? "por encima del rango de referencia" : "above the reference range";
      else category = lang === "es" ? "en el rango de obesidad para detección" : "in the obesity screening range";

      result.hidden = false;
      result.innerHTML = lang === "es"
        ? "<span class='tool-result-number'>" + bmi.toFixed(1) + "</span><strong>Tu IMC está " + category + ".</strong><p>Es una medida de detección, no un diagnóstico. No distingue grasa, músculo ni distribución corporal. Coméntalo con un profesional de salud si te preocupa.</p>"
        : "<span class='tool-result-number'>" + bmi.toFixed(1) + "</span><strong>Your BMI is " + category + ".</strong><p>It is a screening measure, not a diagnosis. It does not distinguish fat, muscle, or fat distribution. Discuss it with a healthcare professional if you are concerned.</p>";
    });
  }

  var plannerForm = document.querySelector("[data-planner-form]");
  if (plannerForm) {
    plannerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var days = Number(plannerForm.elements.days.value);
      var minutes = Number(plannerForm.elements.minutes.value);
      var equipment = plannerForm.elements.equipment.value;
      var shift = plannerForm.elements.shift.value;
      var output = document.querySelector("[data-planner-result]");
      if (!output) return;

      var splitEn = days === 2 ? "Two full-body sessions" : days === 3 ? "Three full-body sessions" : "Two upper-body and two lower-body sessions";
      var splitEs = days === 2 ? "Dos sesiones de cuerpo completo" : days === 3 ? "Tres sesiones de cuerpo completo" : "Dos sesiones de torso y dos de tren inferior";
      var equipmentEn = equipment === "none" ? "bodyweight movements" : equipment === "dumbbells" ? "bodyweight plus dumbbells" : "basic gym equipment";
      var equipmentEs = equipment === "none" ? "movimientos con peso corporal" : equipment === "dumbbells" ? "peso corporal y mancuernas" : "equipo básico de gimnasio";
      var shiftTipsEn = {
        rotating: "Choose your training days after each rota is published. Keep at least one recovery day after two consecutive sessions.",
        early: "Train after work or before your evening meal. Avoid cutting sleep to force a morning session.",
        late: "Train after waking or at least two hours before your shift when possible.",
        standard: "Anchor sessions to three repeatable calendar blocks and keep one backup window."
      };
      var shiftTipsEs = {
        rotating: "Elige tus días de entrenamiento cuando publiquen cada turno. Deja al menos un día de recuperación después de dos sesiones seguidas.",
        early: "Entrena después del trabajo o antes de la cena. No sacrifiques sueño para forzar una sesión matutina.",
        late: "Entrena al despertar o al menos dos horas antes del turno cuando sea posible.",
        standard: "Fija las sesiones en bloques repetibles del calendario y conserva una ventana de respaldo."
      };

      output.hidden = false;
      output.innerHTML = lang === "es"
        ? "<span class='eyebrow'>Tu punto de partida</span><h3>" + splitEs + " de " + minutes + " minutos</h3><p>Usa " + equipmentEs + ". " + shiftTipsEs[shift] + "</p><p class='small'>Empieza con intensidad moderada, deja 2–3 repeticiones posibles al final de cada serie y aumenta solo cuando la técnica sea estable.</p>"
        : "<span class='eyebrow'>Your starting point</span><h3>" + splitEn + " at " + minutes + " minutes each</h3><p>Use " + equipmentEn + ". " + shiftTipsEn[shift] + "</p><p class='small'>Begin at a moderate effort, leave 2–3 possible repetitions at the end of each set, and progress only when technique is steady.</p>";
    });
  }
})();
