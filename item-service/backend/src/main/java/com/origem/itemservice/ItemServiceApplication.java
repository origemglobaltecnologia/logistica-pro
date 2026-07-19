package com.origem.itemservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@SpringBootApplication
public class ItemServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ItemServiceApplication.class, args);
    }
}

// --- MODELO DE DADOS ---
@Entity
@Table(name = "items")
class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codigo;
    private Double largura;
    private Double altura;
    private Double profundidade;
    private Double peso;
    private Double volume;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String foto; // Armazena a foto em Base64

    // Métodos utilitários
    public void calcularVolume() {
        if (this.largura != null && this.altura != null && this.profundidade != null) {
            this.volume = this.largura * this.altura * this.profundidade;
        } else if (this.volume == null) {
            this.volume = 0.0;
        }
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public Double getLargura() { return largura; }
    public void setLargura(Double largura) { this.largura = largura; }
    public Double getAltura() { return altura; }
    public void setAltura(Double altura) { this.altura = altura; }
    public Double getProfundidade() { return profundidade; }
    public void setProfundidade(Double profundidade) { this.profundidade = profundidade; }
    public Double getPeso() { return peso; }
    public void setPeso(Double peso) { this.peso = peso; }
    public Double getVolume() { return volume; }
    public void setVolume(Double volume) { this.volume = volume; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
}

// --- REPOSITÓRIO (JPA) ---
interface ItemRepository extends JpaRepository<Item, Long> {}

// --- CONTROLLER (ENDPOINTS) ---
@RestController
@RequestMapping("/api/itens")
@CrossOrigin(origins = "*")
class ItemController {

    private final ItemRepository repository;

    public ItemController(ItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Item> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Item criar(@RequestBody Item item) {
        item.calcularVolume();
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public Item atualizar(@PathVariable Long id, @RequestBody Item novoItem) {
        return repository.findById(id).map(item -> {
            item.setCodigo(novoItem.getCodigo());
            item.setLargura(novoItem.getLargura());
            item.setAltura(novoItem.getAltura());
            item.setProfundidade(novoItem.getProfundidade());
            item.setPeso(novoItem.getPeso());
            item.setFoto(novoItem.getFoto());
            
            // Se o front enviar o volume calculado manualmente, prioriza ele caso falte alguma dimensão
            if (novoItem.getVolume() != null) {
                item.setVolume(novoItem.getVolume());
            }
            item.calcularVolume();
            
            return repository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item não encontrado"));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
