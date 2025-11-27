using Microsoft.AspNetCore.Mvc;
using SacSimulator.Core.Models;
using SacSimulator.Core.Services;

namespace SacSimulator.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SacController : ControllerBase
    {
        private readonly ISacCalculationService _sacCalculationService;
        private readonly ILogger<SacController> _logger;

        public SacController(ISacCalculationService sacCalculationService, ILogger<SacController> logger)
        {
            _sacCalculationService = sacCalculationService;
            _logger = logger;
        }

        /// <summary>
        /// Calcula a simulação do Sistema de Amortização Constante (SAC)
        /// </summary>
        /// <param name="request">Parâmetros da simulação</param>
        /// <returns>Resultado completo da simulação SAC</returns>
        [HttpPost("simulate")]
        public ActionResult<SacCalculation> SimulateSac([FromBody] SacSimulationRequest request)
        {
            try
            {
                _logger.LogInformation("Iniciando simulação SAC - Valor: {ValorFinanciado}, Taxa: {TaxaJuros}%, Parcelas: {NumeroParcelas}", 
                    request.ValorFinanciado, request.TaxaJurosAnual, request.NumeroParcelas);

                var result = _sacCalculationService.CalculateSac(request);
                
                _logger.LogInformation("Simulação SAC concluída com sucesso - Total de juros: {ValorTotalJuros}", 
                    result.ValorTotalJuros);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning("Parâmetros inválidos para simulação SAC: {Erro}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro interno ao processar simulação SAC");
                return StatusCode(500, new { error = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Endpoint de verificação de saúde da API
        /// </summary>
        /// <returns>Status da API</returns>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { 
                status = "healthy", 
                timestamp = DateTime.UtcNow,
                version = "1.0.0"
            });
        }
    }
}