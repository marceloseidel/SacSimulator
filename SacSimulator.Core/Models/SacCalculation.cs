namespace SacSimulator.Core.Models
{
    /// <summary>
    /// Representa o resultado de uma simulação SAC
    /// </summary>
    public class SacCalculation
    {
        public decimal ValorFinanciado { get; set; }
        public decimal TaxaJurosAnual { get; set; }
        public decimal TaxaJurosMensal { get; set; }
        public int NumeroParcelas { get; set; }
        public decimal ValorAmortizacao { get; set; }
        public decimal ValorTotalJuros { get; set; }
        public decimal ValorTotalAPagar { get; set; }
        public List<ParcelaSac> Parcelas { get; set; } = new List<ParcelaSac>();
    }

    /// <summary>
    /// Representa uma parcela individual do financiamento SAC
    /// </summary>
    public class ParcelaSac
    {
        public int Numero { get; set; }
        public decimal ValorAmortizacao { get; set; }
        public decimal ValorJuros { get; set; }
        public decimal ValorParcela { get; set; }
        public decimal SaldoDevedor { get; set; }
        public decimal JurosAcumulados { get; set; }
        public decimal AmortizacaoAcumulada { get; set; }
    }

    /// <summary>
    /// DTO para entrada dos parâmetros de simulação
    /// </summary>
    public class SacSimulationRequest
    {
        public decimal ValorFinanciado { get; set; }
        public decimal TaxaJurosAnual { get; set; }
        public int NumeroParcelas { get; set; }
    }
}