package com.logistica;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

// --- DTO ---
class Alocacao {
    private Long id;
    private String codigo;
    private double altura, largura, comprimento, descontoAmarracao;
    private int quantidade;
    private LocalDateTime data = LocalDateTime.now();

    public Alocacao() {}

    @JsonProperty("id") public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public double getAltura() { return altura; }
    public void setAltura(double altura) { this.altura = altura; }
    public double getLargura() { return largura; }
    public void setLargura(double largura) { this.largura = largura; }
    public double getComprimento() { return comprimento; }
    public void setComprimento(double comprimento) { this.comprimento = comprimento; }
    public double getDescontoAmarracao() { return descontoAmarracao; }
    public void setDescontoAmarracao(double descontoAmarracao) { this.descontoAmarracao = descontoAmarracao; }
    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
}

// --- Service ---
@Service
class AlocacaoService {
    private final List<Alocacao> memoria = new ArrayList<>();
    private final AtomicLong contador = new AtomicLong(1);

    @CircuitBreaker(name = "alocacaoService", fallbackMethod = "fallbackSalvar")
    public Alocacao salvar(Alocacao a) { a.setId(contador.getAndIncrement()); memoria.add(a); return a; }

    public Alocacao fallbackSalvar(Alocacao a, Throwable t) { return new Alocacao(); }
    public List<Alocacao> listar() { return memoria; }
    public void deletar(Long id) { memoria.removeIf(a -> a.getId().equals(id)); }

    public Alocacao atualizar(Long id, Alocacao a) {
        for (Alocacao existente : memoria) {
            if (existente.getId().equals(id)) {
                existente.setCodigo(a.getCodigo());
                existente.setAltura(a.getAltura());
                existente.setLargura(a.getLargura());
                existente.setComprimento(a.getComprimento());
                existente.setQuantidade(a.getQuantidade());
                return existente;
            }
        }
        return null;
    }
}

// --- Configuração CORS Global ---
@Configuration
class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*").allowedMethods("*").allowedHeaders("*");
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/alocacoes")
class AlocacaoController {
    private final AlocacaoService service;
    public AlocacaoController(AlocacaoService service) { this.service = service; }

    @PostMapping public Alocacao criar(@RequestBody Alocacao a) { return service.salvar(a); }
    @GetMapping public List<Alocacao> listar() { return service.listar(); }
    @PutMapping("/{id}") public Alocacao atualizar(@PathVariable Long id, @RequestBody Alocacao a) { return service.atualizar(id, a); }
    @DeleteMapping("/{id}") public void deletar(@PathVariable Long id) { service.deletar(id); }
}
