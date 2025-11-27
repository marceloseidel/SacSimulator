using SacSimulator.Core.Models;

namespace SacSimulator.Core.Services
{
    /// <summary>
    /// Interface para o serviço de cálculo SAC
    /// </summary>
    public interface ISacCalculationService
    {
        SacCalculation CalculateSac(SacSimulationRequest request);
    }

    /// <summary>
    /// Serviço responsável pelos cálculos do Sistema de Amortização Constante (SAC)
    /// </summary>
    public class SacCalculationService : ISacCalculationService
    {
        /// <summary>
        /// Calcula a simulação completa do financiamento SAC
        /// </summary>
        /// <param name="request">Parâmetros da simulação</param>
        /// <returns>Resultado completo da simulação SAC</returns>
        public SacCalculation CalculateSac(SacSimulationRequest request)
        {
            // Validações básicas
            ValidateInput(request);

            // Calcula taxa de juros mensal
            var taxaJurosMensal = request.TaxaJurosAnual / 100 / 12;
            
            // Calcula valor da amortização (constante em SAC)
            var valorAmortizacao = request.ValorFinanciado / request.NumeroParcelas;

            var result = new SacCalculation
            {
                ValorFinanciado = request.ValorFinanciado,
                TaxaJurosAnual = request.TaxaJurosAnual,
                TaxaJurosMensal = taxaJurosMensal,
                NumeroParcelas = request.NumeroParcelas,
                ValorAmortizacao = valorAmortizacao
            };

            // Calcula cada parcela
            var saldoDevedor = request.ValorFinanciado;
            decimal jurosAcumulados = 0;
            decimal amortizacaoAcumulada = 0;

            for (int i = 1; i <= request.NumeroParcelas; i++)
            {
                var juros = saldoDevedor * taxaJurosMensal;
                var valorParcela = valorAmortizacao + juros;
                
                jurosAcumulados += juros;
                amortizacaoAcumulada += valorAmortizacao;
                saldoDevedor -= valorAmortizacao;

                var parcela = new ParcelaSac
                {
                    Numero = i,
                    ValorAmortizacao = valorAmortizacao,
                    ValorJuros = juros,
                    ValorParcela = valorParcela,
                    SaldoDevedor = Math.Max(0, saldoDevedor), // Evita valores negativos por arredondamento
                    JurosAcumulados = jurosAcumulados,
                    AmortizacaoAcumulada = amortizacaoAcumulada
                };

                result.Parcelas.Add(parcela);
            }

            // Calcula totais
            result.ValorTotalJuros = jurosAcumulados;
            result.ValorTotalAPagar = request.ValorFinanciado + jurosAcumulados;

            return result;
        }

        /// <summary>
        /// Valida os parâmetros de entrada
        /// </summary>
        /// <param name="request">Parâmetros a serem validados</param>
        /// <exception cref="ArgumentException">Lançado quando os parâmetros são inválidos</exception>
        private void ValidateInput(SacSimulationRequest request)
        {
            if (request.ValorFinanciado <= 0)
                throw new ArgumentException("O valor financiado deve ser maior que zero.");

            if (request.TaxaJurosAnual < 0)
                throw new ArgumentException("A taxa de juros não pode ser negativa.");

            if (request.NumeroParcelas <= 0)
                throw new ArgumentException("O número de parcelas deve ser maior que zero.");

            if (request.NumeroParcelas > 480) // 40 anos
                throw new ArgumentException("O número de parcelas não pode exceder 480 meses.");
        }
    }
}