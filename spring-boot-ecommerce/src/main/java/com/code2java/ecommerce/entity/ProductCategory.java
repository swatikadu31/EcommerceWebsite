package com.code2java.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Table(name="product_category")
@Data
public class ProductCategory {
    @Id
    @Column(name="id")
    private Long id;
    @Column(name="category_name")
    private String categoryName;
@OneToMany(cascade = CascadeType.ALL,mappedBy = "category")
    private Set<Product> products;
}
