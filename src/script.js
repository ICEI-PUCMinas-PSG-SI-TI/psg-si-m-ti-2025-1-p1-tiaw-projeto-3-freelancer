document.addEventListener("DOMContentLoaded", function () {
    const calculateSalaryButton = document.getElementById("calculateSalary");
    const hoursWorkedInput = document.getElementById("hoursWorked");
    const hourlyRateInput = document.getElementById("hourlyRate");
    const totalSalaryInput = document.getElementById("totalSalary");

    if (!calculateSalaryButton || !hoursWorkedInput || !hourlyRateInput || !totalSalaryInput) {
        console.error("Erro: Um ou mais elementos não foram encontrados no DOM.");
        return;
    }

    console.log("Todos os elementos foram encontrados com sucesso.");

    // Calcula o salário total
    calculateSalaryButton.addEventListener("click", function () {
        console.log("Botão de calcular clicado.");

        const hoursWorked = parseFloat(hoursWorkedInput.value);
        const hourlyRate = parseFloat(hourlyRateInput.value);

        console.log("Horas Trabalhadas:", hoursWorked);
        console.log("Salário por Hora:", hourlyRate);

        // Verifica se os valores são válidos
        if (isNaN(hoursWorked) || isNaN(hourlyRate) || hoursWorked <= 0 || hourlyRate <= 0) {
            alert("Por favor, insira valores válidos para as horas trabalhadas e o salário por hora.");
            return;
        }

        // Calcula o salário total
        const totalSalary = hoursWorked * hourlyRate;
        totalSalaryInput.value = `R$ ${totalSalary.toFixed(2)}`;
        console.log("Salário Total Calculado:", totalSalary);
    });
});